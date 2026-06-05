'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { sendReceivedEmail } from '@/lib/email';

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

  const { data: existingReservations } = await supabase
    .from('reservations')
    .select('code');

  const existingCodes = new Set(existingReservations?.map(r => r.code) || []);

  let code = '';
  let attempts = 0;
  while (attempts < 100) {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 1000 to 9999
    const candidateCode = `#${randomNum}`;
    if (!existingCodes.has(candidateCode)) {
      code = candidateCode;
      break;
    }
    attempts++;
  }

  if (!code) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    code = `#${randomNum}`;
  }

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

  // Send initial email if email address is provided (non-blocking)
  if (data.email) {
    sendReceivedEmail(data).catch(err => {
      console.error('Failed to send reservation received email:', err);
    });
  }

  return { success: true, reservation: data };
}