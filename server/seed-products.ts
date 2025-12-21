import { getUncachableStripeClient } from './stripeClient';

async function seedProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('Creating Pro Plan...');
  const proPlan = await stripe.products.create({
    name: 'Pro Plan',
    description: 'For growing businesses - 100 AI generations/month, all templates, priority support',
    metadata: {
      tier: 'pro',
      generations: '100',
      featured: 'true',
    },
  });

  await stripe.prices.create({
    product: proPlan.id,
    unit_amount: 2900,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { plan: 'pro-monthly' },
  });

  console.log('Pro Plan created:', proPlan.id);

  console.log('Creating Enterprise Plan...');
  const enterprisePlan = await stripe.products.create({
    name: 'Enterprise Plan',
    description: 'For teams and agencies - Unlimited AI generations, custom branding, API access, dedicated support',
    metadata: {
      tier: 'enterprise',
      generations: 'unlimited',
    },
  });

  await stripe.prices.create({
    product: enterprisePlan.id,
    unit_amount: 4999,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { plan: 'enterprise-monthly' },
  });

  console.log('Enterprise Plan created:', enterprisePlan.id);

  console.log('Creating Enterprise Plus Plan...');
  const enterprisePlusPlan = await stripe.products.create({
    name: 'Enterprise Plus Plan',
    description: 'Full API access, white-labeling, unlimited team members, dedicated support',
    metadata: {
      tier: 'enterprise_plus',
      generations: 'unlimited',
    },
  });

  await stripe.prices.create({
    product: enterprisePlusPlan.id,
    unit_amount: 9900,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { plan: 'enterprise_plus-monthly' },
  });

  console.log('Enterprise Plus Plan created:', enterprisePlusPlan.id);

  console.log('Products seeded successfully!');
}

seedProducts().catch(console.error);
