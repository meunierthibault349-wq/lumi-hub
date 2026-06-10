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

export type ClientRow = {
  id: string;
  name: string;
  full_name: string;
  sector: string;
  color: string;
  pack: string;
  mrr: number;
  status: 'actif' | 'attente_client' | 'demarrage';
  contact: string;
  email: string;
  last_contact: string;
  pending: { text: string; owner: 'lumi' | 'client' }[];
  notes: string[];
  vehicles?: { model: string; year: number }[] | null;
  created_at?: string;
};

export type ProjectRow = {
  id: string;
  title: string;
  client_id: string;
  client: string;
  client_color: string;
  status: 'livré' | 'en_cours' | 'en_attente_client' | 'demarrage';
  progress: number;
  priority: string;
  ref: string;
  devis: string;
  deadline: string;
  summary: string;
  livrables: { icon: string; type: string; name: string }[];
  agents: string[];
  created_at?: string;
};

export type InvoiceRow = {
  id: string;
  client: string;
  client_color: string;
  description: string;
  amount: number;
  date: string;
  status: 'encaisse' | 'en_attente' | 'a_faire';
  created_at?: string;
};

export type MilestoneRow = {
  id: number;
  title: string;
  date: string;
  color: string;
  client_color: string;
};
