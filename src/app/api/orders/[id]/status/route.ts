import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('orders')
      .select('status, table_number')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // A simple estimated time logic
    let estimatedMinutes = 0;
    if (data.status === 'pending') estimatedMinutes = 20;
    else if (data.status === 'preparing') estimatedMinutes = 15;
    else if (data.status === 'ready') estimatedMinutes = 2;

    return NextResponse.json({
      status: data.status,
      estimatedMinutes
    });
  } catch (error) {
    console.error('Order status GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check auth
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    const cashierSession = cookieStore.get('cashier_session');
    
    if (!adminSession && !cashierSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Map status to timestamp column
    let updateData: any = { status };
    if (status === 'preparing') updateData.preparing_at = new Date().toISOString();
    else if (status === 'ready') updateData.ready_at = new Date().toISOString();
    else if (status === 'served' || status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
      updateData.status = 'served'; // Ensure consistency with existing 'served' status
    }

    // Get order to know its table
    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select('table_number')
      .eq('id', id)
      .single();

    if (fetchError || !orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order
    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Order status update error:', updateError);
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    // Update table status
    if (orderData.table_number) {
      let tableStatus = 'ordering';
      if (status === 'preparing') tableStatus = 'waiting';
      else if (status === 'ready') tableStatus = 'ready';
      else if (status === 'served') tableStatus = 'delivered'; // Brief says "delivered" -> blue (seated)

      await supabase
        .from('restaurant_tables')
        .update({ status: tableStatus })
        .eq('id', orderData.table_number);
    }

    return NextResponse.json({ success: true, status: updateData.status });
  } catch (error) {
    console.error('Order status PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
