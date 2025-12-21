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

  console.log('Creating Business Plan...');
  const businessPlan = await stripe.products.create({
    name: 'Business Plan',
    description: 'For teams - Unlimited AI generations, custom branding, API access, dedicated support',
    metadata: {
      tier: 'business',
      generations: 'unlimited',
    },
  });

  await stripe.prices.create({
    product: businessPlan.id,
    unit_amount: 4900,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { plan: 'business-monthly' },
  });

  console.log('Business Plan created:', businessPlan.id);

  console.log('Products seeded successfully!');
}

seedProducts().catch(console.error);
