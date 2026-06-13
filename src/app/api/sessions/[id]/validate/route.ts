import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('sessions')
      .select('id, table_id, status')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false, error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      valid: data.status === 'active',
      session: data
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 });
  }
}
