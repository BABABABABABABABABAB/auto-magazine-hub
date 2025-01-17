import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hhcnnpnfuuyocatanfuo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoY25ucG5mdXV5b2NhdGFuZnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjE1MzksImV4cCI6MjA1MDUzNzUzOX0.1gici0a2emjvMxOU15hXH1TS16Sea1Ys-JfWa6JMLUc";

class QueryBuilder {
  private table: string;
  private columns: string | undefined;
  private conditions: { column: string; value: any }[];
  private orderByColumn: string | undefined;
  private orderAscending: boolean;
  private limitCount: number | undefined;

  constructor(table: string) {
    this.table = table;
    this.conditions = [];
    this.orderAscending = true;
  }

  select(columns?: string) {
    this.columns = columns;
    return this;
  }

  eq(column: string, value: any) {
    this.conditions.push({ column, value });
    return {
      order: (column: string, { ascending = true } = {}) => {
        this.orderByColumn = column;
        this.orderAscending = ascending;
        return {
          eq: (column: string, value: any) => this.eq(column, value),
          limit: (count: number) => ({
            single: () => this.executeSingle(),
            maybeSingle: () => this.executeSingle()
          })
        };
      },
      limit: (count: number) => {
        this.limitCount = count;
        return {
          single: () => this.executeSingle(),
          maybeSingle: () => this.executeSingle()
        };
      }
    };
  }

  order(column: string, { ascending = true } = {}) {
    this.orderByColumn = column;
    this.orderAscending = ascending;
    return {
      eq: (column: string, value: any) => this.eq(column, value),
      limit: (count: number) => {
        this.limitCount = count;
        return {
          single: () => this.executeSingle(),
          maybeSingle: () => this.executeSingle()
        };
      }
    };
  }

  private async execute() {
    // Simulated database query
    return {
      data: [],
      error: null
    };
  }

  private async executeSingle() {
    const result = await this.execute();
    return {
      data: result.data[0] || null,
      error: result.error
    };
  }
}

class SupabaseClient {
  from(table: string) {
    return {
      select: (columns?: string) => new QueryBuilder(table).select(columns),
      insert: (data: any[]) => Promise.resolve({ data, error: null }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ data, error: null })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
      })
    };
  }

  storage = {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => ({ data: { path }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: path }, error: null })
    })
  };
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);