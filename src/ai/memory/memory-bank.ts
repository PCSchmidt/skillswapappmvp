/**
 * Memory Bank Implementation for SkillSwap (In-Memory Version)
 * 
 * This file implements a simplified in-memory version of the Memory Bank pattern.
 * It provides memory capabilities to enhance AI context and improve user experience.
 */

import OpenAI from 'openai';

// Types for Memory Bank
export interface Memory {
  id: number;
  type: string; // 'preference', 'interaction', 'feedback', etc.
  content: string;
  embedding?: number[];
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface UserMemory {
  id: number;
  user_id: string;
  memory_id: number;
  relevance_score?: number;
  created_at: Date;
}

export interface SkillInterest {
  id: number;
  user_id: string;
  skill_category: string;
  interest_level: number;
  last_updated: Date;
}

export interface MemoryBankOptions {
  vectorDimensions?: number;
  maxResults?: number;
  relevanceThreshold?: number;
  openaiApiKey?: string;
}

/**
 * SkillSwap Memory Bank class for storing and retrieving AI memories
 * This is a simplified in-memory implementation without SQLite dependencies
 */
export class MemoryBank {
  private memories: Memory[] = [];
  private userMemories: UserMemory[] = [];
  private skillInterests: SkillInterest[] = [];
  private nextMemoryId = 1;
  private nextUserMemoryId = 1;
  private nextSkillInterestId = 1;
  private openai: OpenAI | null = null;
  private options: Required<MemoryBankOptions>;
  
  constructor(options: MemoryBankOptions = {}) {
    this.options = {
      vectorDimensions: options.vectorDimensions || 1536, // OpenAI embeddings dimension
      maxResults: options.maxResults || 5,
      relevanceThreshold: options.relevanceThreshold || 0.75,
      openaiApiKey: options.openaiApiKey || process.env.OPENAI_API_KEY || '',
    };
    
    // Initialize OpenAI client if API key is available
    if (this.options.openaiApiKey) {
      try {
        this.openai = new OpenAI({
          apiKey: this.options.openaiApiKey,
        });
      } catch (error) {
        console.warn('Failed to initialize OpenAI client:', error);
        this.openai = null;
      }
    }
  }
  
  /**
   * Store a new memory
   */
  async store(params: {
    type: string;
    content: string;
    metadata?: Record<string, unknown>;
    userId?: string;
  }): Promise<number> {
    try {
      const { type, content, metadata = {}, userId } = params;
      
      if (!content || !type) {
        throw new Error('Memory content and type are required');
      }
      
      // Generate embedding for vector search if OpenAI is available
      let embedding: number[] | undefined;
      if (this.openai) {
        embedding = await this.generateEmbedding(content);
      }
      
      // Create new memory
      const memoryId = this.nextMemoryId++;
      const newMemory: Memory = {
        id: memoryId,
        type,
        content,
        embedding,
        metadata,
        created_at: new Date(),
      };
      
      // Add to memories array
      this.memories.push(newMemory);
      
      // If userId is provided, link memory to user
      if (userId) {
        const newUserMemory: UserMemory = {
          id: this.nextUserMemoryId++,
          user_id: userId,
          memory_id: memoryId,
          created_at: new Date(),
        };
        this.userMemories.push(newUserMemory);
      }
      
      return memoryId;
    } catch (error) {
      console.error('Error storing memory:', error);
      throw error;
    }
  }
  
  /**
   * Retrieve memories based on similarity to the query
   */
  async retrieve(params: {
    query: string;
    type?: string;
    userId?: string;
    limit?: number;
  }): Promise<Memory[]> {
    try {
      const { /* query, */ type, userId, limit = this.options.maxResults } = params;
      
      // Filter memories
      let filteredMemories = [...this.memories];
      
      // Filter by type if provided
      if (type) {
        filteredMemories = filteredMemories.filter(memory => memory.type === type);
      }
      
      // Filter by userId if provided
      if (userId) {
        const userMemoryIds = this.userMemories
          .filter(um => um.user_id === userId)
          .map(um => um.memory_id);
        
        filteredMemories = filteredMemories.filter(memory => 
          userMemoryIds.includes(memory.id)
        );
      }
      
      // Assign random relevance scores for simplicity
      // In a real implementation, this would use embeddings for semantic similarity
      const scoredMemories = filteredMemories.map(memory => ({
        ...memory,
        relevanceScore: Math.random()
      }));
      
      // Sort by relevance and filter by threshold
      const results = scoredMemories
        .filter(m => m.relevanceScore >= this.options.relevanceThreshold)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
      
      return results;
    } catch (error) {
      console.error('Error retrieving memories:', error);
      return [];
    }
  }
  
  /**
   * Store a user's interest in a skill category
   */
  async trackSkillInterest(
    userId: string,
    skillCategory: string,
    interestLevel: number = 5
  ): Promise<void> {
    try {
      // Check if this skill interest already exists
      const existingIndex = this.skillInterests.findIndex(
        si => si.user_id === userId && si.skill_category === skillCategory
      );
      
      if (existingIndex >= 0) {
        // Update existing interest
        this.skillInterests[existingIndex].interest_level += interestLevel;
        this.skillInterests[existingIndex].last_updated = new Date();
      } else {
        // Create new interest
        this.skillInterests.push({
          id: this.nextSkillInterestId++,
          user_id: userId,
          skill_category: skillCategory,
          interest_level: interestLevel,
          last_updated: new Date()
        });
      }
    } catch (error) {
      console.error('Error tracking skill interest:', error);
      throw error;
    }
  }
  
  /**
   * Get user's top skill interests
   */
  getTopSkillInterests(userId: string, limit: number = 5): { category: string; level: number }[] {
    try {
      return this.skillInterests
        .filter(si => si.user_id === userId)
        .sort((a, b) => {
          // Sort by interest level (descending)
          if (b.interest_level !== a.interest_level) {
            return b.interest_level - a.interest_level;
          }
          // If interest levels are equal, sort by last updated (descending)
          return b.last_updated.getTime() - a.last_updated.getTime();
        })
        .slice(0, limit)
        .map(si => ({
          category: si.skill_category,
          level: si.interest_level
        }));
    } catch (error) {
      console.error('Error getting top skill interests:', error);
      return [];
    }
  }
  
  /**
   * Generate embedding vector for text using OpenAI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.openai) {
      console.warn('OpenAI client not available, returning zero vector');
      return new Array(this.options.vectorDimensions).fill(0);
    }
    
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Return a zero vector as fallback
      return new Array(this.options.vectorDimensions).fill(0);
    }
  }
  
  /**
   * Clear all data (for testing purposes)
   */
  clear(): void {
    this.memories = [];
    this.userMemories = [];
    this.skillInterests = [];
    this.nextMemoryId = 1;
    this.nextUserMemoryId = 1;
    this.nextSkillInterestId = 1;
  }
}

// Export singleton instance with default options
let memoryBankInstance: MemoryBank | null = null;

export function getMemoryBank(options?: MemoryBankOptions): MemoryBank {
  if (!memoryBankInstance) {
    memoryBankInstance = new MemoryBank(options);
  }
  return memoryBankInstance;
}

export default MemoryBank;
