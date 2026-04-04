export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          position: string | null
          role: 'admin' | 'viewer'
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          position?: string | null
          role?: 'admin' | 'viewer'
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          position?: string | null
          role?: 'admin' | 'viewer'
        }
      }
      items: {
        Row: {
          id: string
          name: string
          category: 'Finished Good' | 'Raw Material'
        }
        Insert: {
          id?: string
          name: string
          category: 'Finished Good' | 'Raw Material'
        }
        Update: {
          id?: string
          name?: string
          category?: 'Finished Good' | 'Raw Material'
        }
      }
      stock_movements: {
        Row: {
          id: string
          item_id: string
          quantity: number
          type: 'IN' | 'OUT'
          reason: string | null
          note: string | null
          date: string
          user_id: string | null
        }
        Insert: {
          id?: string
          item_id: string
          quantity: number
          type: 'IN' | 'OUT'
          reason?: string | null
          note?: string | null
          date?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          item_id?: string
          quantity?: number
          type?: 'IN' | 'OUT'
          reason?: string | null
          note?: string | null
          date?: string
          user_id?: string | null
        }
      }
      production_logs: {
        Row: {
          id: string
          bottle_type: '500ml' | '330ml'
          quantity: number
          date: string
          action_type: 'add' | 'replace'
          user_id: string | null
        }
        Insert: {
          id?: string
          bottle_type: '500ml' | '330ml'
          quantity: number
          date?: string
          action_type: 'add' | 'replace'
          user_id?: string | null
        }
        Update: {
          id?: string
          bottle_type?: '500ml' | '330ml'
          quantity?: number
          date?: string
          action_type?: 'add' | 'replace'
          user_id?: string | null
        }
      }
    }
  }
}
