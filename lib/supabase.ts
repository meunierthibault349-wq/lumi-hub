import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TaskRow = {
  id: string;
  title: string;
  project: string;
  priority: number;
  due: string;
  done: boolean;
  overdue: boolean;
  created_at?: string;
};

export type ProspectRow = {
  id: string;
  name: string;
  sector: string;
  tags: string[];
  stage: 'froid' | 'contacte' | 'chaud' | 'signe';
  created_at?: string;
};
