'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { sendReceivedEmail } from '@/lib/email';


function generateEasyToRememberNumber(): string {
  const patterns = [
    // Pattern 1: AABB (A and B are distinct, A != 0)
    () => {
      const a = Math.floor(1 + Math.random() * 9); // 1-9
      let b = Math.floor(Math.random() * 10); // 0-9
      while (a === b) b = Math.floor(Math.random() * 10);
      return `${a}${a}${b}${b}`;
    },
    // Pattern 2: ABAB (A and B are distinct, A != 0)
    () => {
      const a = Math.floor(1 + Math.random() * 9);
      let b = Math.floor(Math.random() * 10);
      while (a === b) b = Math.floor(Math.random() * 10);
      return `${a}${b}${a}${b}`;
    },
    // Pattern 3: AB00 (A != 0, B != 0)
    () => {
      const a = Math.floor(1 + Math.random() * 9);
      const b = Math.floor(1 + Math.random() * 9);
      return `${a}${b}00`;
    },
    // Pattern 4: A00B (A != 0, B != 0)
    () => {
      const a = Math.floor(1 + Math.random() * 9);
      const b = Math.floor(1 + Math.random() * 9);
      return `${a}00${b}`;
    },
    // Pattern 5: AAAB (A != 0, A != B)
    () => {
      const a = Math.floor(1 + Math.random() * 9);
      let b = Math.floor(Math.random() * 10);
      while (a === b) b = Math.floor(Math.random() * 10);
      return `${a}${a}${a}${b}`;
    },
    // Pattern 6: ABBB (A != 0, A != B)
    () => {
      const a = Math.floor(1 + Math.random() * 9);
      let b = Math.floor(Math.random() * 10);
      while (a === b) b = Math.floor(Math.random() * 10);
      return `${a}${b}${b}${b}`;
    },
    // Pattern 7: Consecutive digits
    () => {
      const sequences = [
        '1234', '2345', '3456', '4567', '5678', '6789',
        '4321', '5432', '6543', '7654', '8765', '9876'
      ];
      return sequences[Math.floor(Math.random() * sequences.length)];
    }
  ];

  const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
  return randomPattern();
}

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
    const randomNumStr = generateEasyToRememberNumber();
    const candidateCode = `#${randomNumStr}`;
    if (!existingCodes.has(candidateCode)) {
      code = candidateCode;
      break;
    }
    attempts++;
  }

  if (!code) {
    code = `#${generateEasyToRememberNumber()}`;
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