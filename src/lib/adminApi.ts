import { supabase } from '@/lib/supabase';

const ADMIN_PASS = 'smpn28ptk@';

export async function adminInsert<T>(
  table: string,
  data: Record<string, unknown>,
): Promise<T | null> {
  const { data: result, error } = await supabase.rpc('admin_insert_row', {
    p_pass: ADMIN_PASS,
    p_table: table,
    p_data: data,
  });
  if (error) {
    console.error('adminInsert failed:', error);
    return null;
  }
  return result as T;
}

export async function adminUpdate<T>(
  table: string,
  id: string,
  data: Record<string, unknown>,
): Promise<T | null> {
  const { data: result, error } = await supabase.rpc('admin_update_row', {
    p_pass: ADMIN_PASS,
    p_table: table,
    p_id: id,
    p_data: data,
  });
  if (error) {
    console.error('adminUpdate failed:', error);
    return null;
  }
  return result as T;
}

export async function adminDelete(
  table: string,
  id: string,
): Promise<boolean> {
  const { error } = await supabase.rpc('admin_delete_row', {
    p_pass: ADMIN_PASS,
    p_table: table,
    p_id: id,
  });
  if (error) {
    console.error('adminDelete failed:', error);
    return false;
  }
  return true;
}
