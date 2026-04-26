import { NextResponse } from 'next/server';
import { getReservations, updateReservationStatus, markReservationSeen, markAllReservationsSeen, deleteReservation } from '@/app/(admin)/admin/reservations/actions';
import { createReservation } from '@/app/(public)/reserve/actions';

export async function GET() {
  const reservations = await getReservations();
  return NextResponse.json(reservations);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await createReservation(formData);

    if (result.success) {
      return NextResponse.json({ success: true, reservation: result.reservation }, { status: 201 });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Reservation POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create reservation' }, { status: 500 });
  }
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