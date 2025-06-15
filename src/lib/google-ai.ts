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


