import { Resend } from 'resend';
import { Reservation } from '@/types/reservation';

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && process.env.NODE_ENV === 'production') {
    // Only throw in production if we're actually trying to send
    // During build, we might not have the key
  }
  return new Resend(apiKey || 're_dummy_key_for_build');
};

export async function sendConfirmationEmail(reservation: Reservation) {
  if (!reservation.email) return { success: false, error: 'No email address provided' };

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: 'Sugi Sushi <reservations@sugi-sushi.com>',
      to: [reservation.email],
      subject: `Reservation Confirmed - Sugi Sushi ${reservation.code}`,
      html: `
        <div dir="ltr" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff; color: #333333;">
          <div style="background-color: #060608; padding: 40px; text-align: center;">
            <h1 style="color: #c4a661; margin: 0; font-family: 'Georgia', serif; font-style: italic; font-size: 32px; letter-spacing: -1px;">SUGI SUSHI</h1>
            <p style="color: rgba(255,255,255,0.6); margin-top: 10px; text-transform: uppercase; letter-spacing: 3px; font-size: 10px;">Modern Japanese Cuisine</p>
          </div>
          
          <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #c4a661; font-size: 24px; margin-bottom: 10px;">Your Reservation is Confirmed!</h2>
              <p style="color: #666; font-size: 16px;">We are delighted to welcome you to Sugi Sushi.</p>
            </div>

            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Reservation Code</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #c4a661; font-family: monospace; font-size: 18px;">${reservation.code}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Guest Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${reservation.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Date</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${reservation.date}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Time</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${reservation.time}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 14px;">Guests</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold;">${reservation.guests} ${reservation.guests === 1 ? 'Person' : 'People'}</td>
                </tr>
              </table>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />

            <div dir="rtl" style="text-align: right;">
              <h2 style="color: #c4a661; font-size: 24px; margin-bottom: 10px;">تم تأكيد حجزك!</h2>
              <p style="color: #666; font-size: 16px;">يسعدنا استقبالكم في سوجي سوشي.</p>
              
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 5px 0;"><strong>الاسم:</strong> ${reservation.name}</p>
                <p style="margin: 5px 0;"><strong>التاريخ:</strong> ${reservation.date}</p>
                <p style="margin: 5px 0;"><strong>الوقت:</strong> ${reservation.time}</p>
                <p style="margin: 5px 0;"><strong>عدد الأفراد:</strong> ${reservation.guests}</p>
                <p style="margin: 5px 0;"><strong>رمز الحجز:</strong> <span style="color: #c4a661;">${reservation.code}</span></p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <p style="color: #888; font-size: 14px;">If you need to cancel or modify your reservation, please contact us at +971 (0) 50 123 4567</p>
              <p style="color: #888; font-size: 14px; margin-top: 5px;">إذا كنت بحاجة إلى إلغاء أو تعديل حجزك، يرجى الاتصال بنا على 0501234567</p>
            </div>
          </div>
          
          <div style="background-color: #fcfcfc; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #aaa; font-size: 12px; margin: 0;">&copy; 2024 Sugi Sushi. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected Email Error:', err);
    return { success: false, error: err };
  }
}

export async function sendReceivedEmail(reservation: Reservation) {
  if (!reservation.email) return { success: false, error: 'No email address provided' };

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: 'Sugi Sushi <reservations@sugi-sushi.com>',
      to: [reservation.email],
      subject: `Reservation Received - Sugi Sushi ${reservation.code}`,
      html: `
        <div dir="ltr" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff; color: #333333;">
          <div style="background-color: #060608; padding: 40px; text-align: center;">
            <h1 style="color: #c4a661; margin: 0; font-family: 'Georgia', serif; font-style: italic; font-size: 32px; letter-spacing: -1px;">SUGI SUSHI</h1>
            <p style="color: rgba(255,255,255,0.6); margin-top: 10px; text-transform: uppercase; letter-spacing: 3px; font-size: 10px;">Modern Japanese Cuisine</p>
          </div>
          
          <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #c4a661; font-size: 24px; margin-bottom: 10px;">Reservation Request Received</h2>
              <p style="color: #666; font-size: 16px;">Thank you for choosing Sugi Sushi. We have received your reservation request and are currently reviewing it.</p>
              <p style="color: #c4a661; font-weight: bold;">We will send you another email once your reservation is confirmed.</p>
            </div>

            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Reservation Code</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #c4a661; font-family: monospace; font-size: 18px;">${reservation.code}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Date</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${reservation.date}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 14px;">Time</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold;">${reservation.time}</td>
                </tr>
              </table>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />

            <div dir="rtl" style="text-align: right;">
              <h2 style="color: #c4a661; font-size: 24px; margin-bottom: 10px;">تم استلام طلب الحجز</h2>
              <p style="color: #666; font-size: 16px;">شكراً لاختياركم سوجي سوشي. لقد استلمنا طلب الحجز الخاص بكم ونقوم بمراجعته حالياً.</p>
              <p style="color: #c4a661; font-weight: bold;">سنقوم بإرسال رسالة أخرى فور تأكيد الحجز.</p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <p style="color: #888; font-size: 14px;">If you have any questions, please contact us at +971 (0) 50 123 4567</p>
            </div>
          </div>
          
          <div style="background-color: #fcfcfc; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #aaa; font-size: 12px; margin: 0;">&copy; 2024 Sugi Sushi. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected Email Error:', err);
    return { success: false, error: err };
  }
}
