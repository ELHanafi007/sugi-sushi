import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    
    // Fetch order to get table_id
    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select('table_id')
      .eq('id', id)
      .single();

    if (fetchError || !orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (orderData.table_id) {
      const { error: updateError } = await supabase
        .from('restaurant_tables')
        .update({ status: 'billing' })
        .eq('id', orderData.table_id);

      if (updateError) {
        console.error('Request bill error:', updateError);
        return NextResponse.json({ error: 'Failed to request bill' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Request bill API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
