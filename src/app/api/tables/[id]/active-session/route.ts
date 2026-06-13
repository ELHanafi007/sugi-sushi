import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // This is the tableId
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('sessions')
      .select('id, table_id, status')
      .eq('table_id', id)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ hasSession: false });
    }

    return NextResponse.json({
      hasSession: true,
      sessionId: data.id
    });
  } catch (error) {
    console.error('Active session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
