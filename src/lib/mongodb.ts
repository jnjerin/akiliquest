// ============================================================================
// MONGODB CONNECTION AND OPERATIONS
// Handles all database interactions for Akiliquest
// ============================================================================

import { MongoClient, Db, Collection } from 'mongodb';
import { 
  Topic, 
  CuriosityTrail, 
  UserSession, 
  COLLECTION_NAMES,
  isTopic,
  isCuriosityTrail 
} from './types';

// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================

/**
 * Global MongoDB client instance
 * Uses a singleton pattern to reuse connections across API calls
 * This prevents connection exhaustion and improves performance
 */
let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Establishes connection to MongoDB Atlas
 * Uses connection pooling for optimal performance
 */
export async function connectToDatabase(): Promise<Db> {
  // If we already have a connection, reuse it
  // This is crucial for serverless environments
  if (db && client) {
    return db;
  }

  try {
    // Get connection string from environment variables
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB...');
    
    // Create new MongoDB client with optimized settings
    client = new MongoClient(uri, {
      // Connection pool settings for better performance
      maxPoolSize: 10,          // Maximum number of connections
      serverSelectionTimeoutMS: 5000,  // How long to try connecting
      socketTimeoutMS: 45000,   // How long to wait for responses
    //   bufferMaxEntries: 0,      // Disable mongoose buffering
    });

    // Actually connect to the database
    await client.connect();
    
    // Select the database (from your connection string)
    db = client.db('akiliquest');
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Create indexes for better query performance
    await createIndexes();
    
    return db;
  } catch (error: string | any) {
    console.error('❌ MongoDB connection failed:', error);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

/**
 * Creates database indexes for optimal query performance (to help find data quickly)
 */
async function createIndexes(): Promise<void> {
    if (!db) return;
  
    try {
      const topicsCollection = db.collection(COLLECTION_NAMES.TOPICS);
      const trailsCollection = db.collection(COLLECTION_NAMES.TRAILS);
  
      // Index for text search on topics
      await topicsCollection.createIndex({ 
        title: "text", 
        description: "text", 
        tags: "text" 
      });
      
      // Index for finding topics by category and difficulty
      await topicsCollection.createIndex({ 
        category: 1, 
        difficulty: 1 
      });
      
      // Index for sorting by popularity (exploration count)
      await topicsCollection.createIndex({ 
        explorationCount: -1 
      });
      
      // Index for finding trails by topic
      await trailsCollection.createIndex({ 
        topicId: 1 
      });
      
      // Index for sorting trails by generation date
      await trailsCollection.createIndex({ 
        generatedAt: -1 
      });
  
      console.log('Database indexes created successfully!');
    } catch (error) {
      console.error('⚠️ Index creation failed:', error);
    }
}
  
  /**
   * Gracefully closes database connection
   * Important for cleanup in serverless environments
   */
  export async function closeDatabaseConnection(): Promise<void> {
    if (client) {
      await client.close();
      client = null;
      db = null;
      console.log('Database connection closed');
    }
  }
  
  // ============================================================================
  // TOPIC OPERATIONS
  // ============================================================================
  
  /**
   * Saves a new topic to the database
   * Includes validation and duplicate checking
   */
  export async function saveTopic(topicData: Omit<Topic, '_id' | 'createdAt' | 'updatedAt'>): Promise<Topic> {
    const database = await connectToDatabase();
    const collection = database.collection<Topic>(COLLECTION_NAMES.TOPICS);
  
    try {
      // Check if topic already exists (case-insensitive)
      const existingTopic = await collection.findOne({
        title: { $regex: new RegExp(`^${topicData.title}$`, 'i') }
      });
  
      if (existingTopic) {
        // Update exploration count and return existing topic
        const updatedTopic = await collection.findOneAndUpdate(
          { _id: existingTopic._id },
          { 
            $inc: { explorationCount: 1 },
            $set: { updatedAt: new Date() }
          },
          { returnDocument: 'after' }
        );
        return updatedTopic.value!;
      }
  
      // Create new topic with timestamps
      const newTopic: Topic = {
        ...topicData,
        createdAt: new Date(),
        updatedAt: new Date(),
        explorationCount: 1,
      };
  
      // Validate data structure
      if (!isTopic(newTopic)) {
        throw new Error('Invalid topic data structure');
      }
  
      const result = await collection.insertOne(newTopic);
      
      // Return the created topic with its new ID
      return {
        ...newTopic,
        _id: result.insertedId.toString(),
      };
  
    } catch (error) {
      console.error('❌ Error saving topic:', error);
      throw new Error(`Failed to save topic: ${error.message}`);
    }
  }
  
  /**
   * Retrieves a topic by its ID
   */
  export async function getTopicById(topicId: string): Promise<Topic | null> {
    const database = await connectToDatabase();
    const collection = database.collection<Topic>(COLLECTION_NAMES.TOPICS);
  
    try {
      const topic = await collection.findOne({ _id: topicId });
      return topic;
    } catch (error) {
      console.error('❌ Error fetching topic:', error);
      return null;
    }
  }
  
  /**
   * Searches for topics using text search
   * Returns topics ranked by relevance
   */
  export async function searchTopics(query: string, limit: number = 10): Promise<Topic[]> {
    const database = await connectToDatabase();
    const collection = database.collection<Topic>(COLLECTION_NAMES.TOPICS);
  
    try {
      // Use MongoDB's text search with scoring
      const topics = await collection
        .find(
          { $text: { $search: query } },
          { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .toArray();
  
      return topics;
    } catch (error) {
      console.error('❌ Error searching topics:', error);
      // Fallback to simple regex search if text search fails
      return await collection
        .find({
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ]
        })
        .limit(limit)
        .toArray();
    }
  }
  
  /**
   * Gets popular topics based on exploration count
   */
  export async function getPopularTopics(limit: number = 20): Promise<Topic[]> {
    const database = await connectToDatabase();
    const collection = database.collection<Topic>(COLLECTION_NAMES.TOPICS);
  
    try {
      return await collection
        .find({})
        .sort({ explorationCount: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('❌ Error fetching popular topics:', error);
      return [];
    }
  }
  
