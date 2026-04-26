'use server';

import { Reservation } from '@/types/reservation';
import { revalidatePath } from 'next/cache';
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

  const { data: countData } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true });

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

  revalidatePath('/reserve');
  return { success: true, reservation: data };
}

export async function getReservations() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }

  return data as Reservation[];
}

export async function getUnseenReservations() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('is_seen', false)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching unseen reservations:', error);
    return [];
  }

  return data as Reservation[];
}

export async function updateReservationStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled'
) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating reservation:', error);
    return false;
  }

  revalidatePath('/admin/reservations');
  return true;
}

export async function markReservationSeen(id: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('reservations')
    .update({ is_seen: true })
    .eq('id', id);

  if (error) {
    console.error('Error marking reservation seen:', error);
    return false;
  }

  revalidatePath('/admin/reservations');
  return true;
}

export async function markAllReservationsSeen() {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('reservations')
    .update({ is_seen: true })
    .eq('is_seen', false);

  if (error) {
    console.error('Error marking all reservations seen:', error);
    return false;
  }

  revalidatePath('/admin/reservations');
  return true;
}

export async function deleteReservation(id: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting reservation:', error);
    return false;
  }

  revalidatePath('/admin/reservations');
  return true;
}