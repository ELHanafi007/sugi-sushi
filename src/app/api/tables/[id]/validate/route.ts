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
      .from('restaurant_tables')
      .select('id, label, capacity, status')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false, error: 'Table not found' }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      table: data
    });
  } catch (error) {
    console.error('Table validation error:', error);
    return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 });
  }
}
