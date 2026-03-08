import DodoPayments from 'dodopayments'

let instance: DodoPayments | null = null

export function getDodo(): DodoPayments {
  if (instance) return instance

  const bearerToken = process.env.DODO_API_KEY
  if (!bearerToken) {
    throw new Error('Missing DODO_API_KEY')
  }

  const environment = process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode'

  instance = new DodoPayments({ bearerToken, environment })

  return instance
}
