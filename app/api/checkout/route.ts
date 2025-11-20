// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { z } from 'zod';

// Shape of a single cart item coming from the client
// `image` is optional to gracefully handle any legacy/partial cart items
// that might not have an image set (e.g. from older localStorage data).
const checkoutItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().nonnegative(),
    quantity: z.number().int().positive(),
    image: z.string().optional().nullable(), // URL or path
});

const checkoutBodySchema = z.object({
    items: z.array(checkoutItemSchema).min(1),
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type CheckoutRequestBody = z.infer<typeof checkoutBodySchema>;

export async function POST(request: NextRequest) {
    try {
        // Get and validate the cart items from the request
        const json = await request.json();
        const parsed = checkoutBodySchema.safeParse(json);

        if (!parsed.success) {
            console.error('Invalid checkout request body:', parsed.error.flatten());
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 },
            );
        }

        const { items } = parsed.data;

        // Transform your cart items into Stripe's format
        // Stripe needs: name, price (in cents!), quantity, and valid absolute image URLs
        const lineItems = items.map((item) => {
            let imageUrl: string | undefined = undefined;

            // Only process image if it exists
            if (item.image) {
                // Check if the image is already an absolute URL
                if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
                    imageUrl = item.image;
                } else if (item.image.startsWith('/')) {
                    // Relative path - prepend the base URL
                    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
                    imageUrl = `${baseUrl}${item.image}`;
                }
            }

            return {
                price_data: {
                    currency: process.env.NEXT_PUBLIC_CURRENCY_FORMAT ?? 'usd',
                    product_data: {
                        name: item.name,
                        ...(imageUrl ? { images: [imageUrl] } : {}), // only send images if we have a valid URL
                    },
                    unit_amount: Math.round(item.price * 100), // Convert dollars to cents
                },
                quantity: item.quantity,
            };
        });

        const origin = request.headers.get('origin');
        if (!origin) {
            return NextResponse.json(
                { error: 'Missing origin header' },
                { status: 400 },
            );
        }

        // Create a checkout session with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Accept credit/debit cards
            line_items: lineItems,
            mode: 'payment', // One-time payment (not subscription)
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart`,
        });
        

        if (!session.url) {
            return NextResponse.json(
                { error: 'Unable to create checkout session' },
                { status: 500 },
            );
        }

        // Send back the session URL
        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error('Stripe error:', error);
        return NextResponse.json(
            { error: 'Error creating checkout session' },
            { status: 500 },
        );
    }
}
