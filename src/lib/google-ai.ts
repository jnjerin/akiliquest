// ============================================================================
// GOOGLE CLOUD AI INTEGRATION
// Handles all AI operations for generating curiosity content
// ============================================================================

import { VertexAI } from '@google-cloud/vertexai';
import { AIResponse, APP_CONSTANTS } from './types';

// ============================================================================
// AI CLIENT SETUP
// ============================================================================

/**
 * Global Vertex AI client instance
 * Initialized once and reused across requests for efficiency
 */
let vertexAI: VertexAI | null = null;

/**
 * Initializes the Google Cloud Vertex AI client
 * Uses service account authentication from environment variables
 */
function initializeVertexAI(): VertexAI {
  if (vertexAI) {
    return vertexAI;
  }

  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

    if (!projectId) {
      throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is required');
    }

    console.log('🤖 Initializing Google Cloud Vertex AI...');
    
    vertexAI = new VertexAI({
      project: projectId,
      location: location,
    });

    console.log('✅ Vertex AI initialized successfully');
    return vertexAI;
  } catch (error: string | any) {
    console.error('❌ Failed to initialize Vertex AI:', error);
    throw new Error(`AI initialization failed: ${error.message}`);
  }
}

// ============================================================================
// PROMPT TEMPLATES
// Well-crafted prompts are crucial for consistent AI responses
// ============================================================================

/**
 * Generates a comprehensive prompt for topic exploration
 * This is the core prompt that drives curiosity trail generation
 */
function createExplorationPrompt(topic: string): string {
    return `You are Akiliquest, an AI that helps people explore topics through curiosity-driven learning. Your goal is to create fascinating learning journeys that connect ideas in unexpected ways.
  
  TOPIC TO EXPLORE: "${topic}"
  
  Please provide a comprehensive exploration following this EXACT JSON structure:
  
  {
    "summary": "A compelling 2-3 sentence overview that captures the essence and importance of this topic",
    "connections": [
      {
        "title": "Connection Title",
        "description": "Detailed explanation of this connected concept (2-3 sentences)",
        "relationship": "How this connects to the main topic",
        "confidence": 0.95
      }
    ],
    "keywords": ["key", "terms", "related", "to", "topic"],
    "difficulty": "beginner|intermediate|advanced",
    "estimatedReadingTime": 5
  }
  
  REQUIREMENTS:
  1. Generate exactly 5 connections that are:
     - Intellectually stimulating
     - Span different domains when possible
     - Include both obvious and surprising connections
     - Range from practical applications to theoretical concepts
  
  2. Make connections that would genuinely spark curiosity
  3. Ensure descriptions are accessible but not oversimplified
  4. Confidence scores should reflect how strong the connection is (0.7-1.0)
  5. Estimated reading time should be realistic (3-15 minutes)
  
  Focus on creating "aha moments" - connections that make people think "I never thought about it that way!"
  
  Respond ONLY with valid JSON, no additional text.`;
}
  
  /**
 * Creates a prompt for finding deeper connections
 * Used when user wants to explore further
 */
function createDeeperExplorationPrompt(topic: string, existingConnections: string[]): string {
    return `You are AkiliQuest, exploring deeper layers of curiosity for: "${topic}"
  
  ALREADY EXPLORED: ${existingConnections.join(', ')}
  
  Find 3 NEW connections that go deeper or explore different angles. Focus on:
  - Advanced applications or implications
  - Historical context or future possibilities  
  - Cross-disciplinary connections
  - Philosophical or ethical dimensions
  
  Respond with the same JSON structure as before, but avoid repeating the already explored connections.`;
}
  
/**
 * Creates a prompt for topic validation and enhancement
 * Helps clean up user input and suggest better search terms
 */
function createTopicValidationPrompt(userInput: string): string {
    return `Analyze this topic input: "${userInput}"
  
  If it's a valid, explorable topic, respond with:
  {
    "isValid": true,
    "cleanedTopic": "cleaned version of the topic",
    "suggestions": ["alternative", "phrasings", "if", "helpful"]
  }
  
  If it's too vague, inappropriate, or not explorable, respond with:
  {
    "isValid": false,
    "reason": "explanation of why it's not suitable",
    "suggestions": ["better", "alternative", "topics"]
  }
  
  Valid topics should be:
  - Specific enough to explore meaningfully
  - Educational or intellectually stimulating
  - Appropriate for all audiences
  - Not just yes/no questions
  
  Respond ONLY with valid JSON.`;
}

// ============================================================================
// CORE AI FUNCTIONS
// ============================================================================

/**
 * Generates a complete curiosity exploration for a given topic
 * This is the main function that powers the exploration feature
 */
export async function generateCuriosityExploration(topic: string): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 Generating curiosity exploration for: "${topic}"`);
      
      const vertexAI = initializeVertexAI();
      const model = vertexAI.preview.getGenerativeModel({
        model: 'gemini-1.5-pro-preview-0409',
        generationConfig: {
          maxOutputTokens: 2048,      // Enough for detailed responses
          temperature: 0.7,           // Balance creativity with accuracy
          topP: 0.8,                  // Focus on most likely tokens
          topK: 40,                   // Reasonable diversity
        },
      });
  
      const prompt = createExplorationPrompt(topic);
      
      // Make the AI request with timeout
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI request timeout')), APP_CONSTANTS.AI_TIMEOUT)
        )
      ]) as any;
  
      const response = result.response;
      const text = response.text();
  
      console.log('🤖 Raw AI response received, parsing...');
  
      // Parse and validate the JSON response
      const parsedResponse = parseAIResponse(text);
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ Curiosity exploration generated in ${processingTime}ms`);
  
      return parsedResponse;
  
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`❌ AI generation failed after ${processingTime}ms:`, error);
      
      // Return a fallback response instead of throwing
      return createFallbackResponse(topic, error.message);
    }
  }
  
  /**
   * Validates and cleans user input before processing
   * Helps ensure we get good results from the AI
   */
  export async function validateAndCleanTopic(userInput: string): Promise<{
    isValid: boolean;
    cleanedTopic?: string;
    reason?: string;
    suggestions: string[];
  }> {
    try {
      console.log(`🧹 Validating topic input: "${userInput}"`);
      
      // Basic validation first
      if (!userInput || userInput.trim().length < APP_CONSTANTS.MIN_TOPIC_LENGTH) {
        return {
          isValid: false,
          reason: 'Topic is too short',
          suggestions: ['Try a more specific topic', 'Add more details to your search']
        };
      }
  
      if (userInput.length > APP_CONSTANTS.MAX_TOPIC_LENGTH) {
        return {
          isValid: false,
          reason: 'Topic is too long',
          suggestions: ['Try a shorter, more focused topic', 'Break it into smaller concepts']
        };
      }
  
      const vertexAI = initializeVertexAI();
      const model = vertexAI.preview.getGenerativeModel({
        model: 'gemini-1.5-flash-preview-0514', // Faster model for validation
        generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.3,           // Lower creativity for validation
        },
      });
  
      const prompt = createTopicValidationPrompt(userInput);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
  
      const validation = JSON.parse(cleanJsonResponse(text));
      
      console.log(`✅ Topic validation complete: ${validation.isValid ? 'valid' : 'invalid'}`);
      return validation;
  
    } catch (error) {
      console.error('❌ Topic validation failed:', error);
      
      // Fallback to basic validation
      return {
        isValid: true, // Be permissive if AI validation fails
        cleanedTopic: userInput.trim(),
        suggestions: []
      };
    }
  }
  
  /**
   * Generates topic suggestions based on user's exploration history
   * Helps users discover new areas of interest
   */
  export async function generateTopicSuggestions(exploredTopics: string[], count: number = 5): Promise<string[]> {
    try {
      console.log('💡 Generating topic suggestions...');
      
      const vertexAI = initializeVertexAI();
      const model = vertexAI.preview.getGenerativeModel({
        model: 'gemini-1.5-flash-preview-0514',
        generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.8,           // Higher creativity for suggestions
        },
      });
  
      const prompt = `Based on these previously explored topics: ${exploredTopics.join(', ')}
  
  Generate ${count} new topic suggestions that would interest someone with these curiosities. Focus on:
  - Related but unexplored areas
  - Cross-connections between their interests
  - Slightly more advanced concepts
  - Surprising tangential topics
  
  Respond with a JSON array of topic strings:
  ["topic 1", "topic 2", "topic 3", ...]`;
  
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      const suggestions = JSON.parse(cleanJsonResponse(text));
      
      console.log(`✅ Generated ${suggestions.length} topic suggestions`);
      return Array.isArray(suggestions) ? suggestions : [];
  
    } catch (error) {
      console.error('❌ Topic suggestion generation failed:', error);
      
      // Return some default suggestions
      return [
        'The science of decision making',
        'How languages shape thought',
        'The mathematics of music',
        'Biomimicry in technology',
        'The psychology of creativity'
      ];
    }
  }
  