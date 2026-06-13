import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    const cashierSession = cookieStore.get('cashier_session');
    
    if (!adminSession && !cashierSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*');

    if (error) {
      console.error('Floorplan fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch floorplan' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Floorplan API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
