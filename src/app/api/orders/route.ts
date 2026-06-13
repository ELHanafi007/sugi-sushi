import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { tableId, sessionId, items, generalNote } = await request.json();

    if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'tableId and items are required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Calculate total price
    const totalPrice = items.reduce((sum: number, item: any) => {
      const priceStr = item.price.toString();
      const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      return sum + (priceNum * item.quantity);
    }, 0);

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        table_number: tableId, // Keeping backward compatibility with existing orders structure
        table_id: tableId,
        session_id: sessionId || null,
        general_note: generalNote || null,
        items: items,
        total_price: totalPrice,
        status: 'pending' // Existing code uses 'pending' instead of 'placed'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Update table status to 'waiting'
    await supabase
      .from('restaurant_tables')
      .update({ status: 'waiting' })
      .eq('id', tableId);

    return NextResponse.json(orderData, { status: 201 });

  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
