import Stripe from 'stripe'

let instance: Stripe | null = null

export function getStripe(): Stripe {
  if (instance) return instance

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }

  instance = new Stripe(secretKey, {
    apiVersion: '2026-01-28.clover',
  })

  return instance
}
