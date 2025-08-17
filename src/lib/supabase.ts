import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database tables
export type User = {
  id: string
  name: string
  email: string
  role: 'manager' | 'member'
  created_at: string
}

export type Task = {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  type: string
  assigned_to: string
  created_by: string
  start_date: string
  due_date: string
  estimated_hours: number
  time_spent: number
  created_at: string
}

export type Template = {
  id: string
  name: string
  description: string
  checklist: Record<string, any>
  created_by: string
  created_at: string
}

export type TaskLog = {
  id: string
  task_id: string
  user_id: string
  action: 'created' | 'updated' | 'status_change' | 'time_log' | 'completed'
  duration?: number
  created_at: string
}
