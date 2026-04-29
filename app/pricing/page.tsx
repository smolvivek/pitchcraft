import { headers } from 'next/headers'
import { PricingPageClient } from './PricingPageClient'

export default async function PricingPage() {
  const headersList = await headers()
  const country = headersList.get('x-vercel-ip-country') ?? ''
  const defaultCurrency = country === 'IN' ? 'inr' : 'usd'

  return <PricingPageClient defaultCurrency={defaultCurrency} />
}
