// ============================================================================
// CORE DATA TYPES
// ============================================================================

/**
 * Represents a single topic in our knowledge base
 * This is the fundamental unit of curiosity in Akiliquest
 */
export interface Topic {
    _id?: string;                    // MongoDB ObjectId (optional for new topics)
    title: string;                   // Human-readable topic name
    description: string;             // Brief description of the topic
    category?: string;               // Subject area (science, history, etc.)
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];                  // Keywords for searching/filtering
    embedding?: number[];            // Vector representation for similarity search
    createdAt: Date;                 // When this topic was first explored
    updatedAt: Date;                 // Last time this topic was accessed
    explorationCount: number;        // How many times this topic was explored
  }
  
  /**
   * A single node in the curiosity trail
   * Represents one step in the learning journey
   */
  export interface CuriosityNode {
    id: string;                      // Unique identifier for this node
    title: string;                   // What this step is about
    description: string;             // Detailed explanation
    level: number;                   // Depth in the trail (0 = starting topic)
    connections: string[];           // IDs of connected nodes
    nodeType: 'concept' | 'application' | 'connection' | 'deep-dive';
    confidence: number;              // AI confidence in this connection (0-1)
    sources?: string[];              // References or sources (future feature)
  }
  
  /**
   * Complete curiosity trail generated for a topic
   * This is what gets displayed to the user
   */
  export interface CuriosityTrail {
    _id?: string;                    // MongoDB ObjectId
    topicId: string;                 // Reference to the original topic
    topic: string;                   // Topic name for easy access
    summary: string;                 // AI-generated overview
    nodes: CuriosityNode[];          // The learning path
    totalConnections: number;        // Count of all connections
    maxDepth: number;                // Deepest level in the trail
    generatedAt: Date;               // When this trail was created
    aiModel: string;                 // Which AI model generated this
    processingTime: number;          // How long generation took (ms)
  }
  
  /**
   * Response from Google Cloud AI
   * Raw data before we structure it into a trail
   */
  export interface AIResponse {
    summary: string;                 // Topic overview
    connections: {                   // Related concepts found by AI
      title: string;
      description: string;
      relationship: string;          // How it connects to main topic
      confidence: number;            // AI confidence (0-1)
    }[];
    keywords: string[];              // Important terms extracted
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedReadingTime: number;    // Minutes to understand this topic
  }
  
  /**
   * User session data for gamification
   * Tracks exploration progress and achievements
   */
  export interface UserSession {
    _id?: string;                    // MongoDB ObjectId
    sessionId: string;               // Unique session identifier
    topicsExplored: string[];        // List of topic IDs explored
    trailsGenerated: number;         // Count of trails created
    totalExplorationTime: number;    // Time spent exploring (minutes)
    curiosityScore: number;          // Gamification score
    achievements: string[];          // Unlocked achievements
    createdAt: Date;                 // Session start time
    lastActiveAt: Date;              // Last activity timestamp
  }
  
  /**
   * Database connection configuration
   * Used for MongoDB setup and connection management
   */
  export interface DatabaseConfig {
    uri: string;                     // MongoDB connection string
    dbName: string;                  // Database name
    collections: {                   // Collection names
      topics: string;
      trails: string;
      sessions: string;
    };
  }
  
  /**
   * Google Cloud AI configuration
   * Settings for AI service integration
   */
  export interface AIConfig {
    projectId: string;               // Google Cloud project ID
    location: string;                // AI service region
    model: string;                   // AI model to use
    maxTokens: number;               // Maximum response length
    temperature: number;             // Creativity level (0-1)
  }
  
  /**
   * API response wrapper
   * Standardized format for all API responses
   */
  export interface ApiResponse<T = any> {
    success: boolean;                // Whether the request succeeded
    data?: T;                        // Response data (if successful)
    error?: {                        // Error details (if failed)
      message: string;
      code: string;
      details?: any;
    };
    metadata?: {                     // Additional information
      timestamp: Date;
      processingTime: number;
      requestId: string;
    };
  }
  
  /**
   * Vector search result
   * Used for finding similar topics
   */
  export interface SimilarityResult {
    topicId: string;                 // ID of similar topic
    title: string;                   // Topic title
    similarity: number;              // Similarity score (0-1)
    explanation: string;             // Why these topics are similar
  }
  
  // ============================================================================
  // TYPE GUARDS - Runtime type checking
  // ============================================================================
  
  /**
   * Checks if an object is a valid Topic
   * Useful for validating API inputs
   */
  export function isTopic(obj: any): obj is Topic {
    return (
      typeof obj === 'object' &&
      typeof obj.title === 'string' &&
      typeof obj.description === 'string' &&
      Array.isArray(obj.tags) &&
      obj.createdAt instanceof Date
    );
  }
  
  /**
   * Checks if an object is a valid CuriosityTrail
   * Ensures data integrity before saving to database
   */
  export function isCuriosityTrail(obj: any): obj is CuriosityTrail {
    return (
      typeof obj === 'object' &&
      typeof obj.topic === 'string' &&
      typeof obj.summary === 'string' &&
      Array.isArray(obj.nodes) &&
      typeof obj.totalConnections === 'number'
    );
  }
  
  // ============================================================================
  // CONSTANTS - Application-wide settings
  // ============================================================================
  
  export const APP_CONSTANTS = {
    MAX_TRAIL_DEPTH: 5,              // Maximum levels in curiosity trail
    MAX_CONNECTIONS_PER_NODE: 3,     // Maximum connections per trail node
    MIN_TOPIC_LENGTH: 2,             // Minimum characters in topic search
    MAX_TOPIC_LENGTH: 100,           // Maximum characters in topic search
    CACHE_DURATION: 3600000,         // Cache duration in milliseconds (1 hour)
    AI_TIMEOUT: 30000,               // AI request timeout (30 seconds)
  } as const;
  
  export const COLLECTION_NAMES = {
    TOPICS: 'topics',
    TRAILS: 'trails',
    SESSIONS: 'user_sessions',
  } as const;
  