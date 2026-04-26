'use server';

import { getSupabaseAdmin } from '@/lib/supabase';

export async function createReservation(formData: FormData) {
  const supabase = getSupabaseAdmin();

  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const guests = parseInt(formData.get('guests') as string) || 2;
  const occasion = formData.get('occasion') as string;
  const notes = formData.get('notes') as string;

  const { data: countData, error: countError } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Table check error:', countError);
    return { success: false, error: 'Database table not found. Please run the SQL setup in Supabase.' };
  }

  const codeNum = (countData?.length || 0) + 1;
  const code = `#${codeNum.toString().padStart(4, '0')}`;

  const { data, error } = await supabase
    .from('reservations')
    .insert({
      code,
      name,
      phone,
      email: email || null,
      date,
      time,
      guests,
      occasion: occasion || null,
      notes: notes || null,
      status: 'pending',
      is_seen: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating reservation:', error);
    return { success: false, error: error.message };
  }

  return { success: true, reservation: data };
}