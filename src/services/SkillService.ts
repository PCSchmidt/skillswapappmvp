// src/services/SkillService.ts

import { supabaseClient } from '@/lib/supabase/client'; // Assuming this is the Supabase client
import type { Skill, SkillBrowseFilters } from '@/types/index'; // Placeholder for actual types

// Define a more specific type for skills returned by browseSkills, including user details
export interface BrowsableSkill extends Skill {
  users: { // Assuming 'users' is the alias for the joined user table
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
    location_city: string | null;
    location_state: string | null;
  } | null; // User might be null if not found or not joined properly
}

export class SkillService {
  private supabase = supabaseClient;

  constructor() {
    // In case we need to initialize something later
  }

  /**
   * Fetches skills based on provided filters.
   * Replicates the logic from src/app/skills/browse/page.tsx.
   */
  async browseSkills(filters: SkillBrowseFilters): Promise<{ data: BrowsableSkill[]; error: any }> {
    try {
      let query = this.supabase
        .from('skills')
        .select(`
          *,
          users:user_id (
            id,
            full_name,
            profile_image_url,
            location_city,
            location_state
          )
        `)
        .eq('is_active', true) // Assuming all browsable skills must be active
        .order('created_at', { ascending: false });

      // Apply search filter
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      // Apply category filter
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      // Apply offering type filter ('all', 'offering', 'seeking')
      if (filters.offering && filters.offering !== 'all') {
        query = query.eq('is_offering', filters.offering === 'offering');
      }

      // Apply experience level filter
      if (filters.experience && filters.experience !== 'all') {
        query = query.eq('experience_level', filters.experience);
      }

      // Apply remote friendly filter
      if (filters.remote) {
        query = query.eq('is_remote_friendly', true);
      }

      // Limit results as in the original page
      query = query.limit(100);


      const { data, error } = await query;

      if (error) {
        console.error('Error fetching skills in SkillService:', error);
        return { data: [], error };
      }

      return { data: (data as BrowsableSkill[]) || [], error: null };

    } catch (err: any) {
      console.error('Exception in SkillService.browseSkills:', err);
      return { data: [], error: err };
    }
  }

  // Future methods can be added here:
  // async getSkillById(id: string): Promise<{ data: Skill | null; error: any }> { ... }
  // async createSkill(skillData: Partial<Skill>): Promise<{ data: Skill | null; error: any }> { ... }
  // async updateSkill(id: string, updates: Partial<Skill>): Promise<{ data: Skill | null; error: any }> { ... }
  // async deleteSkill(id: string): Promise<{ error: any }> { ... }
}

// Export an instance of the service
export const skillService = new SkillService();
