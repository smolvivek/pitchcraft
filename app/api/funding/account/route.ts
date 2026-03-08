import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getRazorpay } from '@/lib/razorpay/client'

// POST — register creator's bank account as a Razorpay linked account
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { account_holder_name, account_number, ifsc, pan, email, phone } = body as {
      account_holder_name: string
      account_number: string
      ifsc: string
      pan: string
      email: string
      phone: string
    }

    if (!account_holder_name || !account_number || !ifsc || !pan || !email || !phone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())) {
      return NextResponse.json({ error: 'Invalid IFSC code' }, { status: 400 })
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(pan)) {
      return NextResponse.json({ error: 'Invalid PAN number' }, { status: 400 })
    }

    // Check if already registered
    const adminSupabase = createAdminClient()
    const { data: profile } = await adminSupabase
      .from('users')
      .select('id, razorpay_account_id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (profile.razorpay_account_id) {
      return NextResponse.json({ success: true, already_registered: true })
    }

    const razorpay = getRazorpay()

    // Create linked account (Razorpay Route sub-merchant)
    const account = await razorpay.accounts.create({
      email,
      profile: {
        category: 'media_and_entertainment',
        subcategory: 'streaming',
        addresses: {
          registered: {
            street1: 'NA',
            street2: 'NA',
            city: 'Mumbai',
            state: 'MH',
            postal_code: 400001,
            country: 'IN',
          },
        },
      },
      contact_name: account_holder_name,
      phone: phone.replace(/\D/g, ''),
      type: 'route',
      legal_business_name: account_holder_name,
      business_type: 'individual',
      legal_info: { pan: pan.toUpperCase() },
    })

    const accountId = (account as unknown as { id: string }).id

    // Register stakeholder (required for KYC)
    await razorpay.stakeholders.create(accountId, {
      name: account_holder_name,
      email,
      phone: {
        primary: phone.replace(/\D/g, ''),
      },
      kyc: { pan: pan.toUpperCase() },
    })

    // Store only the account ID — never the raw bank credentials
    await adminSupabase
      .from('users')
      .update({ razorpay_account_id: accountId })
      .eq('auth_id', user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Funding account setup error:', error)
    return NextResponse.json({ error: 'Failed to set up payout account' }, { status: 500 })
  }
}

// GET — check if creator has a linked account set up
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('users')
      .select('razorpay_account_id')
      .eq('auth_id', user.id)
      .single()

    return NextResponse.json({ configured: !!profile?.razorpay_account_id })
  } catch (error) {
    console.error('Funding account check error:', error)
    return NextResponse.json({ error: 'Failed to check account' }, { status: 500 })
  }
}
