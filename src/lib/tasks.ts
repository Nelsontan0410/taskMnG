import { supabase } from './supabase'
import type { Task, TaskLog } from './supabase'

/**
 * Get all tasks for the current user's organization
 */
export async function getTasks(): Promise<{ data: Task[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:assigned_to(name, email),
        created_user:created_by(name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Get tasks assigned to a specific user
 */
export async function getTasksForUser(userId: string): Promise<{ data: Task[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:assigned_to(name, email),
        created_user:created_by(name, email)
      `)
      .eq('assigned_to', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Create a new task
 */
export async function createTask(task: Omit<Task, 'id' | 'created_at'>): Promise<{ data: Task | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()

    if (error) throw error

    // Log the task creation
    await logTaskActivity(data.id, task.created_by, 'created')

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Update a task
 */
export async function updateTask(taskId: string, updates: Partial<Task>, userId: string): Promise<{ data: Task | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error

    // Log the task update
    await logTaskActivity(taskId, userId, 'updated')

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Update task status
 */
export async function updateTaskStatus(taskId: string, status: Task['status'], userId: string): Promise<{ data: Task | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error

    // Log the status change
    await logTaskActivity(taskId, userId, status === 'completed' ? 'completed' : 'status_change')

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error }
  }
}

/**
 * Log task activity
 */
export async function logTaskActivity(
  taskId: string, 
  userId: string, 
  action: TaskLog['action'], 
  duration?: number
): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('task_logs')
      .insert({
        task_id: taskId,
        user_id: userId,
        action,
        duration,
      })

    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error }
  }
}

/**
 * Get recent task activity
 */
export async function getRecentActivity(limit = 10): Promise<{ data: TaskLog[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('task_logs')
      .select(`
        *,
        user:user_id(name),
        task:task_id(title)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Get task statistics for dashboard
 */
export async function getTaskStats(): Promise<{ 
  data: {
    today: number;
    overdue: number;
    completed: number;
    inProgress: number;
    byPriority: Record<Task['priority'], number>;
  } | null; 
  error: any 
}> {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: allTasks, error } = await supabase
      .from('tasks')
      .select('status, priority, due_date')

    if (error) throw error

    const stats = {
      today: 0,
      overdue: 0,
      completed: 0,
      inProgress: 0,
      byPriority: {
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0,
      } as Record<Task['priority'], number>
    }

    allTasks.forEach(task => {
      // Count by status
      if (task.status === 'completed') stats.completed++
      if (task.status === 'in_progress') stats.inProgress++
      
      // Count today's tasks (due today)
      if (task.due_date === today) stats.today++
      
      // Count overdue tasks
      if (task.due_date && task.due_date < today && task.status !== 'completed') {
        stats.overdue++
      }
      
      // Count by priority
      if (task.priority in stats.byPriority) {
        stats.byPriority[task.priority]++
      }
    })

    return { data: stats, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Get all users for task assignment
 */
export async function getUsers(): Promise<{ data: any[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .order('name')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
