import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { tableId } = await request.json();

    if (!tableId) {
      return NextResponse.json({ error: 'tableId is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Verify table exists
    const { data: tableData, error: tableError } = await supabase
      .from('restaurant_tables')
      .select('id')
      .eq('id', tableId)
      .single();

    if (tableError || !tableData) {
      return NextResponse.json({ error: 'Invalid table ID' }, { status: 400 });
    }

    // Create session
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        table_id: tableId,
        status: 'active'
      })
      .select('id')
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    // Update table status to 'seated' if it was 'empty' or anything else
    // (Only if it's not already in a more advanced state, but for simplicity we can set it to seated)
    await supabase
      .from('restaurant_tables')
      .update({ status: 'seated' })
      .eq('id', tableId)
      .eq('status', 'empty'); // Only update if currently empty

    return NextResponse.json({
      sessionId: sessionData.id
    }, { status: 201 });

  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
