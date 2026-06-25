'use server';

import { Reservation } from '@/types/reservation';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendConfirmationEmail } from '@/lib/email';

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
  status: 'pending' | 'confirmed' | 'cancelled',
  table_id?: string | null
) {
  const supabase = getSupabaseAdmin();

  // First get the reservation details to send the email
  const { data: reservation, error: fetchError } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !reservation) {
    console.error('Error fetching reservation for status update:', fetchError);
    return false;
  }

  const updateData: any = { status };
  if (table_id !== undefined) {
    updateData.table_id = table_id;
  }

  const { error } = await supabase
    .from('reservations')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating reservation:', error);
    return false;
  }

  // If status is changed to confirmed, send the email (non-blocking)
  if (status === 'confirmed' && reservation.email) {
    sendConfirmationEmail({ ...reservation, ...updateData } as Reservation).catch(err => {
      console.error('Failed to send confirmation email:', err);
    });
  }

  revalidatePath('/cashier');
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

  revalidatePath('/cashier');
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

  revalidatePath('/cashier');
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

  revalidatePath('/cashier');
  return true;
}
