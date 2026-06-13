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
      .select('*')
      .eq('call_waiter', true);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch flags' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    const cashierSession = cookieStore.get('cashier_session');
    
    if (!adminSession && !cashierSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');

    if (!tableId) {
      return NextResponse.json({ error: 'tableId is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('restaurant_tables')
      .update({ call_waiter: false })
      .eq('id', tableId);

    if (error) {
      return NextResponse.json({ error: 'Failed to clear flag' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
