import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { decryptSession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const session = decryptSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: 'Session expired or invalid.' }, { status: 401 });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, mock } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Invalid payment parameters.' }, { status: 400 });
    }

    const db = readDB();

    // 1. MOCK PAYMENT VERIFICATION HANDLER
    if (mock === true || razorpay_order_id.startsWith('order_mock_')) {
      const paymentRecord = db.payments.find(
        (p) => p.orderId === razorpay_order_id && p.userId === session.userId
      );

      if (!paymentRecord) {
        return NextResponse.json({ error: 'Order record not found for this user.' }, { status: 404 });
      }

      // Update payment record
      paymentRecord.paymentId = razorpay_payment_id;
      paymentRecord.status = 'verified';

      // Upgrade User to Premium
      const userRecord = db.users.find((u) => u.id === session.userId);
      if (userRecord) {
        userRecord.tier = 'premium';
      }

      writeDB(db);

      return NextResponse.json({
        success: true,
        message: 'Mock payment verified successfully! Your account has been upgraded to Premium.',
      });
    }

    // 2. REAL RAZORPAY PAYMENT VERIFICATION HANDLER
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay Secret Key not configured on the server.' }, { status: 500 });
    }

    if (!razorpay_signature) {
      return NextResponse.json({ error: 'Payment signature is required for real verification.' }, { status: 400 });
    }

    // Cryptographic signature check
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    const isValidSignature = generatedSignature === razorpay_signature;

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Payment signature verification failed. Possible fraud alert.' }, { status: 400 });
    }

    const paymentRecord = db.payments.find(
      (p) => p.orderId === razorpay_order_id && p.userId === session.userId
    );

    if (!paymentRecord) {
      return NextResponse.json({ error: 'Order record matching payment not found.' }, { status: 404 });
    }

    // Save success logs
    paymentRecord.paymentId = razorpay_payment_id;
    paymentRecord.status = 'verified';

    // Upgrade User to Premium
    const userRecord = db.users.find((u) => u.id === session.userId);
    if (userRecord) {
      userRecord.tier = 'premium';
    }

    writeDB(db);

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully! Your account has been upgraded to Premium.',
    });

  } catch (error) {
    console.error('Payment verification API error:', error);
    return NextResponse.json({ error: 'Internal server error verifying payment.' }, { status: 500 });
  }
}
