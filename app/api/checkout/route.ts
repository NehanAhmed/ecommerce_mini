// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { z } from 'zod';

const checkoutItemSchema = z.object({
  id: z.string(), // This should be your MongoDB product _id
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  image: z.string().optional().nullable(),
});

const checkoutBodySchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  customerEmail: z.string().email().optional(),
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type CheckoutRequestBody = z.infer<typeof checkoutBodySchema>;

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = checkoutBodySchema.safeParse(json);

    if (!parsed.success) {
      console.error('Invalid checkout request body:', parsed.error.flatten());
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { items, customerEmail } = parsed.data;

    const lineItems = items.map((item) => {
      let imageUrl: string | undefined;

      if (item.image) {
        if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
          imageUrl = item.image;
        } else if (item.image.startsWith('/')) {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          imageUrl = `${baseUrl}${item.image}`;
        }
      }

      return {
        price_data: {
          currency: process.env.NEXT_PUBLIC_CURRENCY_FORMAT ?? 'usd',
          product_data: {
            name: item.name,
            // Store MongoDB product ID in product metadata
            metadata: { productId: item.id },
            ...(imageUrl ? { images: [imageUrl] } : {}),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const origin = request.headers.get('origin');
    if (!origin) {
      return NextResponse.json(
        { error: 'Missing origin header' },
        { status: 400 }
      );
    }

    // Build session metadata with product IDs for webhook
    const itemsMetadata = items.map((i) => ({ id: i.id, qty: i.quantity }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,

      // Collect shipping address (required by your Order model)
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'PK'], // Add countries you support
      },

      // Collect phone number
      phone_number_collection: { enabled: true },

      // Pre-fill customer email if available
      ...(customerEmail && { customer_email: customerEmail }),

      // Store product IDs for webhook to create order items
      metadata: {
        itemIds: JSON.stringify(itemsMetadata),
        itemCount: items.length.toString(),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Unable to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}