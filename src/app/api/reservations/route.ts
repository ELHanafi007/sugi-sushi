import { NextResponse } from 'next/server';
import { getReservations, updateReservationStatus, markReservationSeen, markAllReservationsSeen, deleteReservation } from '@/app/(admin)/admin/reservations/actions';

export async function GET() {
  const reservations = await getReservations();
  return NextResponse.json(reservations);
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    if (status) {
      const success = await updateReservationStatus(id, status);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Reservation PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const success = await deleteReservation(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Reservation DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}