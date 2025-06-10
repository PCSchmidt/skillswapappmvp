// src/lib/supabase/database.ts
import { supabase } from './client'; // Assumes database.ts uses the client from client.ts

export async function getItemById(tableName: string, id: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

export async function createItem(tableName: string, itemData: any) {
  const { data, error } = await supabase
    .from(tableName)
    .insert([itemData])
    .select()
    .single(); // Assuming insert().select().single() is a common pattern
  return { data, error };
}

export interface MyData {
    id: string;
    name: string;
    value?: number;
}

export async function getComplexData(id: string, filter?: string): Promise<{ data: MyData[] | null, error: any }> {
    let query = supabase.from('my_table').select('id, name, value').eq('id', id);
    if (filter) {
        query = query.ilike('name', `%${filter}%`);
    }
    return query.order('name');
}
