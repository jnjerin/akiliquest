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