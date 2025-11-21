// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import Stripe from 'stripe';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/order.model';
import mongoose from 'mongoose';

// Helper to get raw body for signature verification
async function getRawBody(request: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();

  if (!reader) {
    throw new Error('No request body');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(request);
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify the event signature
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${msg}`);
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulCheckout(session);
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.error(`Payment failed for PaymentIntent ${pi.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Error processing webhook: ${msg}`);
    return NextResponse.json(
      { error: `Webhook handler failed: ${msg}` },
      { status: 500 }
    );
  }
}

async function handleSuccessfulCheckout(session: Stripe.Checkout.Session) {
  console.log('Processing successful checkout:', session.id);

  await connectToDatabase();

  // Check idempotency - avoid duplicate orders
  const existingOrder = await Order.findOne({
    'notes': { $regex: session.id }
  });

  if (existingOrder) {
    console.log(`Order already exists for session ${session.id}`);
    return existingOrder;
  }

  // Retrieve full session with expanded data
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items', 'line_items.data.price.product'],
  });

  const lineItems = fullSession.line_items?.data || [];
  const customerDetails = fullSession.customer_details;
  const shippingDetails = fullSession.shipping_details || customerDetails;

  // Parse item IDs from metadata (set during checkout)
  let itemIdMap: Record<string, string> = {};
  try {
    const itemIds = JSON.parse(session.metadata?.itemIds || '[]') as Array<{
      id: string;
      qty: number;
    }>;
    itemIds.forEach((item, idx) => {
      itemIdMap[idx.toString()] = item.id;
    });
  } catch {
    console.warn('Could not parse itemIds from metadata');
  }

  // Map line items to your Order schema format
  const orderItems = lineItems.map((item, idx) => {
    const product = item.price?.product as Stripe.Product;
    const productIdStr = itemIdMap[idx.toString()] || product?.metadata?.productId;
    const unitPrice = (item.price?.unit_amount || 0) / 100;
    const qty = item.quantity || 1;

    return {
      productId: new mongoose.Types.ObjectId(productIdStr),
      productName: product?.name || item.description || 'Unknown Product',
      quantity: qty,
      price: unitPrice,
      total: unitPrice * qty,
    };
  });

  // Calculate totals
  const subtotal = (fullSession.amount_subtotal || 0) / 100;
  const totalAmount = (fullSession.amount_total || 0) / 100;
  const shippingCost = 0; // Free shipping per your cart page
  const tax = totalAmount - subtotal - shippingCost;

  // Build shipping address from Stripe data
  const addr = shippingDetails?.address;
  const shippingAddress = {
    fullName: shippingDetails?.name || customerDetails?.name || 'Customer',
    addressLine1: addr?.line1 || 'N/A',
    addressLine2: addr?.line2 || undefined,
    city: addr?.city || 'N/A',
    state: addr?.state || 'N/A',
    postalCode: addr?.postal_code || 'N/A',
    country: addr?.country || 'N/A',
    phone: shippingDetails?.phone || customerDetails?.phone || 'N/A',
  };

  // Create order matching your schema
  const orderData = {
    customerEmail: customerDetails?.email || session.customer_email || 'unknown@email.com',
    items: orderItems,
    subtotal,
    tax: Math.max(tax, 0), // Ensure non-negative
    shippingCost,
    totalAmount,
    status: 'pending' as const,
    paymentStatus: 'paid' as const,
    paymentMethod: 'stripe',
    shippingAddress,
    notes: `Stripe Session: ${session.id} | Payment Intent: ${session.payment_intent}`,
  };

  const order = await Order.create(orderData);
  console.log(`Order created: ${order.orderNumber} (${order._id})`);

  return order;
}