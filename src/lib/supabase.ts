import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Memeriksa apakah kredensial Supabase telah dikonfigurasi di file environment.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));
};

let clientInstance: SupabaseClient | null = null;

/**
 * Inisialisasi Supabase Client secara aman.
 * Jika kredensial belum diisi di environment, fungsi ini akan memberikan peringatan di konsol
 * tanpa menyebabkan aplikasi crash saat startup.
 */
export const getSupabase = (): SupabaseClient | null => {
  if (clientInstance) {
    return clientInstance;
  }

  if (isSupabaseConfigured()) {
    try {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return clientInstance;
    } catch (error) {
      console.warn('Gagal menginisialisasi Supabase client:', error);
      return null;
    }
  }

  return null;
};

/**
 * Ekspor default instance client Supabase.
 * Menggunakan dummy URL/Key jika belum diisi agar komponen/service yang mengimpor `supabase`
 * tetap memiliki tipe objek SupabaseClient tanpa runtime crash.
 */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-anon-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
