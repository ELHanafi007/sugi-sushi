import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getReservations, updateReservationStatus, markReservationSeen, markAllReservationsSeen, deleteReservation } from '@/lib/reservations-actions';
import { createReservation } from '@/app/(public)/reserve/actions';

async function isAuthorized() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session');
  const cashierSession = cookieStore.get('cashier_session');
  return !!(adminSession || cashierSession);
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const reservations = await getReservations();
  return NextResponse.json(reservations);
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    const cashierSession = cookieStore.get('cashier_session');

    // POST requests can either be public (creating a reservation)
    // or authenticated admin/cashier (like marking as seen, which passes JSON payload)
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      if (!adminSession && !cashierSession) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const body = await request.json();
      if (body.action === 'markSeen' && body.id) {
        const success = await markReservationSeen(body.id);
        return NextResponse.json({ success });
      }
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Public booking creation using form data
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
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id, status, table_id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    if (status || table_id !== undefined) {
      const success = await updateReservationStatus(id, status, table_id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Reservation PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
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