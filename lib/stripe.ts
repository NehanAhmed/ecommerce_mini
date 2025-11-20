// lib/stripe.js
import Stripe from 'stripe';

// This creates a connection to Stripe using your secret key
// It's like opening a secure phone line to Stripe's computers
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(STRIPE_SECRET_KEY);

export default stripe;