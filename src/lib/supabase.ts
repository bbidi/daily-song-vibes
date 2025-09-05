import { createClient } from '@supabase/supabase-js'

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLIC_KEY

// Create a fallback client if variables are missing (for development)
let supabase: ReturnType<typeof createClient>

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Make sure your Supabase integration is properly configured.')
  console.log('Available env vars:', Object.keys(import.meta.env).filter(key => key.includes('SUPABASE')))
  
  // Create a mock client that throws helpful errors
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Supabase not configured') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signInWithOAuth: () => Promise.resolve({ error: new Error('Supabase not configured') }),
    }
  } as any
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }

export type Database = {
  // Add your database types here as you create tables
}