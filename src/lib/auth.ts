import { supabase } from './supabase'
import type { User } from './supabase'

export interface AuthUser extends User {
  id: string
  email: string
  name: string
  role: 'manager' | 'member'
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string, name: string, role: 'manager' | 'member' = 'member') {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (authData.user) {
      // 2. Create user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          role,
        })

      if (profileError) throw profileError
    }

    return { data: authData, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Sign in user with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error }
  }
}

/**
 * Get current authenticated user with profile data
 */
export async function getCurrentUser(): Promise<{ user: AuthUser | null; error: any }> {
  try {
    // Get auth user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError) throw authError
    if (!authUser) return { user: null, error: null }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profileError) throw profileError

    const user: AuthUser = {
      id: authUser.id,
      email: authUser.email!,
      name: profile.name,
      role: profile.role,
      created_at: profile.created_at,
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  } catch (error) {
    return { session: null, error }
  }
}
