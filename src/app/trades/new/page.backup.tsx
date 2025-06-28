/**
 * Backup of the original trade page
 */

'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSupabase } from '@/contexts/SupabaseContext';

export const dynamic = 'force-dynamic';

interface UserSkill {
  id: string;
  skill_type: 'offered' | 'wanted';
  skills?: {
    id: string;
    title: string;
    category: string;
  } | null;
}

interface TargetUser {
  id: string;
  full_name: string | null;
  profile_image_url: string | null;
}

interface TargetSkill {
  id: string;
  title: string;
  description: string | null;
  is_offering: boolean;
}

export default function NewTradePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create Trade Proposal
          </h1>
          <p>Page is temporarily simplified for debugging.</p>
        </div>
      </div>
    </div>
  );
}
