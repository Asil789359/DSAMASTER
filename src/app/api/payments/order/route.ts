import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { decryptSession } from '@/lib/auth';
import Razorpay from 'razorpay';

const PLANS = {
  monthly: { amount: 2499, label: 'AlgoMaster Premium Monthly' }, // INR 2,499
  annual: { amount: 6499, label: 'AlgoMaster Premium Annual' },   // INR 6,499
  lifetime: { amount: 12999, label: 'AlgoMaster Premium Lifetime' } // INR 12,999
};

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

    const { planId } = await req.json();
    if (!planId || !PLANS[planId as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan selection.' }, { status: 400 });
    }

    const selectedPlan = PLANS[planId as keyof typeof PLANS];
    const amountInPaise = selectedPlan.amount * 100;

    const db = readDB();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if real keys are configured
    if (keyId && keySecret) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret
        });

        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: 'receipt_usr_' + session.userId + '_' + Date.now().toString().slice(-6),
          notes: {
            userId: session.userId,
            planId,
            label: selectedPlan.label
          }
        });

        // Add payment to DB
        db.payments.push({
          id: 'pay_' + Math.random().toString(36).substring(2, 11),
          userId: session.userId,
          orderId: order.id,
          paymentId: '',
          amount: selectedPlan.amount,
          status: 'created',
          createdAt: new Date().toISOString()
        });

        writeDB(db);

        return NextResponse.json({
          success: true,
          mock: false,
          keyId: keyId,
          orderId: order.id,
          amount: amountInPaise,
          currency: 'INR',
          name: 'AlgoMaster Platform',
          description: selectedPlan.label,
          prefill: {
            name: session.name,
            email: session.email
          }
        });
      } catch (razorpayError) {
        console.error('Razorpay SDK order creation failed, falling back to mock sandbox:', razorpayError);
      }
    }

    // FALLBACK TO MOCK PAYMENT MODE
    const mockOrderId = 'order_mock_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString().slice(-4);

    db.payments.push({
      id: 'pay_' + Math.random().toString(36).substring(2, 11),
      userId: session.userId,
      orderId: mockOrderId,
      paymentId: '',
      amount: selectedPlan.amount,
      status: 'created',
      createdAt: new Date().toISOString()
    });

    writeDB(db);

    return NextResponse.json({
      success: true,
      mock: true,
      keyId: 'mock_razorpay_key',
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      name: 'AlgoMaster Platform (Sandbox Mode)',
      description: selectedPlan.label + ' (Simulated Checkout)',
      prefill: {
        name: session.name,
        email: session.email
      }
    });

  } catch (error) {
    console.error('Payment order API error:', error);
    return NextResponse.json({ error: 'Internal server error processing payment order.' }, { status: 500 });
  }
}
