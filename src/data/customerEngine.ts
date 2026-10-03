import { 
  CustomerAccount, 
  RiskLevel, 
  Region,
  CommerceCategory, 
  MembershipTier, 
  OrderItem, 
  CustomerComplaint, 
  ShapFeatureAttribution, 
  RetentionTask, 
  BusinessImpactMetrics 
} from '../types/customer';

// Deterministic seed PRNG
function createPrng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const random = createPrng(9824);

const CITIES: Array<{ city: string; area: string; country: string; region: Region; lat: number; lng: number }> = [
  { city: 'Bengaluru', area: 'Indiranagar', country: 'India', region: 'APAC', lat: 12.9716, lng: 77.5946 },
  { city: 'Mumbai', area: 'Bandra West', country: 'India', region: 'APAC', lat: 19.0760, lng: 72.8777 },
  { city: 'Delhi NCR', area: 'Gurugram Cyber Hub', country: 'India', region: 'APAC', lat: 28.4595, lng: 77.0266 },
  { city: 'Hyderabad', area: 'Hitec City', country: 'India', region: 'APAC', lat: 17.3850, lng: 78.4867 },
  { city: 'New York', area: 'Manhattan Midtown', country: 'United States', region: 'North America', lat: 40.7128, lng: -74.0060 },
  { city: 'San Francisco', area: 'SoMa District', country: 'United States', region: 'North America', lat: 37.7749, lng: -122.4194 },
  { city: 'London', area: 'Canary Wharf', country: 'United Kingdom', region: 'EMEA', lat: 51.5074, lng: -0.1278 },
  { city: 'Singapore', area: 'Marina Bay', country: 'Singapore', region: 'APAC', lat: 1.3521, lng: 103.8198 },
  { city: 'Toronto', area: 'Downtown Core', country: 'Canada', region: 'North America', lat: 43.6532, lng: -79.3832 },
  { city: 'Sydney', area: 'Surry Hills', country: 'Australia', region: 'APAC', lat: -33.8688, lng: 151.2093 }
];

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Kabir', 'Sneha', 'Vikram', 'Meera', 'Arjun', 'Isha',
  'Aditya', 'Riya', 'Rahul', 'Pooja', 'Karan', 'Tanvi', 'Daniel', 'Chloe', 'Liam', 'Sophia',
  'Ethan', 'Maya', 'Lucas', 'Emma', 'Oliver', 'Zoe', 'Noah', 'Ava', 'Alexander', 'Mia'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Iyer', 'Mehta', 'Nair', 'Kapoor', 'Gupta', 'Singh',
  'Deshmukh', 'Chopra', 'Banerjee', 'Rao', 'Bose', 'Johnson', 'Smith', 'Williams', 'Brown', 'Taylor',
  'Miller', 'Davis', 'Wilson', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson'
];

const CATEGORIES: CommerceCategory[] = [
  'Quick Commerce & Groceries',
  'Food & Dining Delivery',
  'Daily Essentials & Home',
  'Electronics & Gadgets',
  'Fashion & Apparel'
];

const GROCERY_ITEMS = [
  'Farm Fresh Organic Milk 2L, Hass Avocados (2pc), Sourdough Bread, Eggs 12pk',
  'Baby Spinach, Greek Yogurt, Cold Brew Concentrate, Granola, Almond Milk',
  'Basmati Rice 5kg, Cold-Pressed Mustard Oil, Whole Wheat Flour, Lentils',
  'Imported Dark Chocolate 85%, Sparkling Water 6pk, Mixed Roasted Nuts',
  'Fresh Strawberries, Blueberries, Protein Whey Tub 1kg, Chia Seeds'
];

const FOOD_ITEMS = [
  'Artisanal Neapolitan Margherita Pizza + Garlic Herb Cheesy Pull-Apart',
  'Hyderabadi Chicken Dum Biryani (Family Pack) + Mirchi Ka Salan + Raita',
  'Japanese Salmon Nigiri Platter + Steamed Edamame + Miso Soup',
  'Charcoal Grilled Chicken Burrito Bowl + Guacamole + Corn Tortilla Chips',
  'Thai Green Curry with Jasmine Rice + Crispy Spring Rolls'
];

const ELECTRONICS_ITEMS = [
  'Noise Cancelling Wireless Earbuds (Active Silence) with Fast USB-C',
  'Smart Magnetic Wireless Charging Stand 3-in-1 for Phone & Watch',
  'Ultra-Slim 20,000mAh Power Bank with 65W Laptop Fast Charging',
  'Ergonomic Mechanical Keyboard with RGB Backlit Hot-Swappable Switches'
];

const ESSENTIALS_ITEMS = [
  'Eco-Friendly Plant-Based Laundry Detergent 3L + Fabric Conditioner',
  'Automatic Foam Soap Dispenser + Antibacterial Handwash Refills',
  'Microfiber Cleaning Towels 10pk + Floor Care Concentrate Refill'
];

function generateCustomerOrders(category: CommerceCategory, recency: number, orderCount: number): OrderItem[] {
  const orders: OrderItem[] = [];
  const count = Math.min(orderCount, 6);

  for (let i = 0; i < count; i++) {
    const daysAgo = recency + i * Math.floor(4 + random() * 12);
    const dateObj = new Date(2026, 9, 3 - daysAgo);
    const dateStr = dateObj.toISOString().split('T')[0];

    let items = '';
    let amount = 0;
    let deliveryMins = 12;

    if (category === 'Quick Commerce & Groceries') {
      items = GROCERY_ITEMS[Math.floor(random() * GROCERY_ITEMS.length)];
      amount = Math.round(18 + random() * 65);
      deliveryMins = Math.round(9 + random() * 15);
    } else if (category === 'Food & Dining Delivery') {
      items = FOOD_ITEMS[Math.floor(random() * FOOD_ITEMS.length)];
      amount = Math.round(15 + random() * 55);
      deliveryMins = Math.round(25 + random() * 30);
    } else if (category === 'Electronics & Gadgets') {
      items = ELECTRONICS_ITEMS[Math.floor(random() * ELECTRONICS_ITEMS.length)];
      amount = Math.round(45 + random() * 280);
      deliveryMins = Math.round(180 + random() * 400);
    } else {
      items = ESSENTIALS_ITEMS[Math.floor(random() * ESSENTIALS_ITEMS.length)];
      amount = Math.round(22 + random() * 85);
      deliveryMins = Math.round(60 + random() * 240);
    }

    // Recent orders might have late deliveries if customer is at risk
    const isLate = i === 0 && daysAgo <= recency + 3 && random() > 0.45;
    const rating = isLate ? Math.floor(1 + random() * 2) : Math.floor(4 + random() * 2);

    orders.push({
      id: `ORD-${(80000 + i * 142 + Math.floor(random() * 500)).toString()}`,
      orderNumber: `NX-${(100000 + Math.floor(random() * 899999)).toString()}`,
      date: dateStr,
      category,
      itemsSummary: items,
      amount,
      deliveryTimeMins: isLate ? deliveryMins + 45 : deliveryMins,
      status: isLate && rating === 1 ? 'Delayed' : 'Delivered',
      rating,
      complaintLogged: isLate ? (category === 'Food & Dining Delivery' ? 'Delivery took 58 mins; meal arrived cold.' : 'Late grocery delivery; milk pack crushed.') : undefined
    });
  }

  return orders;
}

function generateComplaints(churnProb: number, orders: OrderItem[]): CustomerComplaint[] {
  const complaints: CustomerComplaint[] = [];
  const lateOrder = orders.find(o => o.rating <= 2);

  if (churnProb > 0.55 && lateOrder) {
    complaints.push({
      id: `CMP-${Math.floor(1000 + random() * 8999)}`,
      date: lateOrder.date,
      category: lateOrder.category === 'Food & Dining Delivery' ? 'Late Delivery' : 'Damaged/Missing Item',
      description: lateOrder.complaintLogged || 'Order was significantly delayed past the promised ETA with no driver updates.',
      resolutionStatus: random() > 0.5 ? 'Pending Review' : 'Resolved with Credit',
      sentiment: 'Frustrated'
    });
  } else if (churnProb > 0.7) {
    complaints.push({
      id: `CMP-${Math.floor(1000 + random() * 8999)}`,
      date: '2026-09-12',
      category: 'Payment/Refund Delay',
      description: 'Refund for missing items took 5 days to reflect in wallet.',
      resolutionStatus: 'Closed',
      sentiment: 'Dissatisfied'
    });
  }

  return complaints;
}

function generateShapAttributions(
  recency: number,
  orders30d: number,
  complaintCount: number,
  appDays30d: number,
  churnProb: number
): ShapFeatureAttribution[] {
  const recencyImpact = recency > 25 ? +(0.18 + (recency / 100) * 0.25).toFixed(3) : -0.15;
  const orderDropImpact = orders30d === 0 ? +0.22 : orders30d < 2 ? +0.08 : -0.14;
  const complaintImpact = complaintCount > 0 ? +(0.15 * complaintCount).toFixed(3) : -0.06;
  const appEngagementImpact = appDays30d < 5 ? +0.16 : appDays30d < 12 ? +0.05 : -0.12;
  const loyaltyImpact = churnProb > 0.6 ? -0.04 : -0.19;

  return [
    {
      feature: 'order_recency_days',
      displayLabel: 'Days Inactive (No Orders Placed)',
      actualValue: `${recency} days`,
      shapValue: recencyImpact,
      isRiskDriver: recencyImpact > 0
    },
    {
      feature: 'monthly_order_velocity',
      displayLabel: 'Orders Placed in Past 30 Days',
      actualValue: `${orders30d} orders`,
      shapValue: orderDropImpact,
      isRiskDriver: orderDropImpact > 0
    },
    {
      feature: 'delivery_complaints_sentiment',
      displayLabel: 'Recent Complaints & Low Ratings',
      actualValue: `${complaintCount} unresolved`,
      shapValue: complaintImpact,
      isRiskDriver: complaintImpact > 0
    },
    {
      feature: 'app_session_frequency',
      displayLabel: 'App Sessions Past 30 Days',
      actualValue: `${appDays30d} days active`,
      shapValue: appEngagementImpact,
      isRiskDriver: appEngagementImpact > 0
    },
    {
      feature: 'lifetime_membership_loyalty',
      displayLabel: 'VIP Pass / Loyalty Stickiness',
      actualValue: 'Historical customer',
      shapValue: loyaltyImpact,
      isRiskDriver: loyaltyImpact > 0
    }
  ];
}

// Generate 4,312 realistic commerce customer records
function generateCommerceCustomers(): CustomerAccount[] {
  const count = 4312;
  const customers: CustomerAccount[] = [];

  for (let i = 0; i < count; i++) {
    const id = `CUST-${(1000 + i).toString()}`;
    const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i % 99}@example.com`;
    const phone = `+1 (555) ${Math.floor(100 + random() * 899)}-${Math.floor(1000 + random() * 8999)}`;

    const cityLoc = CITIES[Math.floor(random() * CITIES.length)];
    const lat = +(cityLoc.lat + (random() - 0.5) * 0.35).toFixed(4);
    const lng = +(cityLoc.lng + (random() - 0.5) * 0.35).toFixed(4);

    const category = CATEGORIES[Math.floor(random() * CATEGORIES.length)];

    // Membership Tier
    const tierRoll = random();
    const membershipTier: MembershipTier = 
      tierRoll < 0.20 ? 'VIP Gold / Pass' :
      tierRoll < 0.50 ? 'Prime Member' :
      tierRoll < 0.75 ? 'Select Member' : 'Standard';

    // Spending & Order Behavior
    let lifetimeOrders = Math.floor(12 + Math.pow(random(), 1.6) * 110);
    if (membershipTier === 'VIP Gold / Pass') lifetimeOrders += 25;

    let avgBasketSize = Math.round(22 + random() * 55);
    if (category === 'Electronics & Gadgets') avgBasketSize = Math.round(85 + random() * 190);
    else if (category === 'Quick Commerce & Groceries') avgBasketSize = Math.round(28 + random() * 45);

    const annualSpend = Math.round(lifetimeOrders * avgBasketSize * (0.8 + random() * 0.5));
    const monthlyAverageSpend = Math.round(annualSpend / 12);

    // Activity & Recency
    // Bimodal distribution: 80% active/recent, 20% slipping/inactive
    const isSlipping = random() < 0.22;
    const recencyDays = isSlipping 
      ? Math.floor(25 + Math.pow(random(), 1.2) * 90) 
      : Math.floor(1 + random() * 18);

    const ordersPast30Days = isSlipping 
      ? (random() > 0.7 ? 1 : 0) 
      : Math.floor(2 + random() * 10);
    const ordersPast90Days = ordersPast30Days + Math.floor(2 + random() * 18);
    const activeAppDaysPast30 = isSlipping 
      ? Math.floor(1 + random() * 4) 
      : Math.floor(8 + random() * 20);
    const cartAbandonmentCount = Math.floor(random() * 5);
    const walletBalance = Math.round(random() * 35);

    const recentOrders = generateCustomerOrders(category, recencyDays, lifetimeOrders);

    // Churn Probability calculation grounded in commerce behavior:
    // Higher recency, 0 orders in 30d, complaints, low app opens drive churn
    let churnScore = 0.10;
    if (recencyDays > 40) churnScore += 0.40;
    else if (recencyDays > 20) churnScore += 0.22;

    if (ordersPast30Days === 0) churnScore += 0.25;
    if (activeAppDaysPast30 <= 3) churnScore += 0.15;
    if (cartAbandonmentCount >= 3) churnScore += 0.10;
    if (recentOrders.some(o => o.rating <= 2)) churnScore += 0.25;

    // Loyalty mitigators
    if (membershipTier === 'VIP Gold / Pass') churnScore -= 0.18;
    if (annualSpend > 2500) churnScore -= 0.10;

    const churnProbability = Math.max(0.04, Math.min(0.96, +(churnScore + (random() - 0.5) * 0.08).toFixed(2)));

    let riskLevel: RiskLevel = 'Low';
    if (churnProbability >= 0.65) riskLevel = 'High';
    else if (churnProbability >= 0.35) riskLevel = 'Medium';

    const complaints = generateComplaints(churnProbability, recentOrders);

    // Primary Risk Reason (The explicit WHY)
    let primaryRiskReason = 'Stable purchase cadence and positive satisfaction';
    const riskFactors: string[] = [];

    if (recentOrders.some(o => o.rating <= 2)) {
      primaryRiskReason = 'Recent 1-star delayed delivery experience led to complete cessation of orders';
      riskFactors.push('1-Star Delivery Rating Logged', 'Order SLA Delay > 45 mins');
    } else if (recencyDays > 45 && ordersPast30Days === 0) {
      primaryRiskReason = 'Sudden drop from 8 orders/mo to 0 orders in the past 45+ days';
      riskFactors.push('45+ Days Purchase Inactivity', '0 Orders in Last 30 Days');
    } else if (cartAbandonmentCount >= 3) {
      primaryRiskReason = 'Abandoned 3 consecutive checkout carts without completing payment';
      riskFactors.push('Repeated Cart Abandonment', 'Declining Session Duration');
    } else if (activeAppDaysPast30 <= 2) {
      primaryRiskReason = 'App open frequency dropped by 75% compared to historical average';
      riskFactors.push('App Inactivity < 2 Opens/Month', 'Disabled Push Notifications');
    } else if (riskLevel === 'Medium') {
      primaryRiskReason = 'Order frequency slowed down by 40% compared to 90-day baseline';
      riskFactors.push('Moderate Order Cadence Slowdown');
    }

    // AI Retention Action Plan with explicit WHY and specific offer
    let recommendedAction = 'Maintain standard engagement and loyalty point updates';
    let recommendationRationale = 'Customer is highly engaged with consistent monthly order velocity';
    let incentiveOffer = 'Earn 2x Loyalty Points on Weekend Deliveries';
    let suggestedChannel: CustomerAccount['suggestedChannel'] = 'Push Notification';
    let estimatedRetentionUplift = '+94% baseline retention';

    if (riskLevel === 'High') {
      if (recentOrders.some(o => o.rating <= 2)) {
        recommendedAction = 'Send Service Recovery Care Package & Direct Apology';
        recommendationRationale = 'Customer had a frustrating delivery delay 2 weeks ago and stopped ordering. A sincere apology plus instant credit restores confidence before they switch to competitors.';
        incentiveOffer = '$12 Instant Wallet Credit + Free Priority Delivery on Next 3 Orders';
        suggestedChannel = 'WhatsApp Direct';
        estimatedRetentionUplift = '+78% probability of re-ordering within 5 days';
      } else if (recencyDays > 45) {
        recommendedAction = 'Deploy High-Value "We Miss You" Basket Re-Engagement Promo';
        recommendationRationale = 'Customer was historically a top spender ($' + annualSpend.toLocaleString() + ' annual GMV) who abruptly stopped ordering. A tailored 25% basket incentive triggers immediate return.';
        incentiveOffer = 'Flat 25% Off Next Grocery Basket (Code: WELCOMEBACK25)';
        suggestedChannel = 'In-App Banner';
        estimatedRetentionUplift = '+68% order recovery rate';
      } else {
        recommendedAction = 'Complimentary 3-Month VIP Gold Pass Upgrade';
        recommendationRationale = 'Active app sessions are fading; offering complimentary zero-delivery-fee status locks in recurring ordering habit.';
        incentiveOffer = 'Free VIP Gold Pass (Zero Delivery Fees for 90 Days)';
        suggestedChannel = 'Push Notification';
        estimatedRetentionUplift = '+72% retention lift over 90 days';
      }
    } else if (riskLevel === 'Medium') {
      recommendedAction = 'Personalized Category Flash Coupon for Frequently Bought Items';
      recommendationRationale = 'Order frequency is dipping slightly. Rewarding their favorite items rekindles purchase momentum.';
      incentiveOffer = 'Save $8 on Your Favorite Pantry Staples';
      suggestedChannel = 'Push Notification';
      estimatedRetentionUplift = '+84% re-engagement likelihood';
    }

    const shapAttributions = generateShapAttributions(
      recencyDays,
      ordersPast30Days,
      complaints.length,
      activeAppDaysPast30,
      churnProbability
    );

    const rScore = recencyDays <= 10 ? 5 : recencyDays <= 25 ? 4 : recencyDays <= 45 ? 3 : recencyDays <= 70 ? 2 : 1;
    const fScore = lifetimeOrders >= 50 ? 5 : lifetimeOrders >= 30 ? 4 : lifetimeOrders >= 18 ? 3 : lifetimeOrders >= 8 ? 2 : 1;
    const mScore = annualSpend >= 3500 ? 5 : annualSpend >= 2000 ? 4 : annualSpend >= 1000 ? 3 : annualSpend >= 400 ? 2 : 1;
    const fm = Math.round((fScore + mScore) / 2);
    let segment: any = 'Hibernating';
    if (rScore >= 4 && fm >= 4) segment = 'Champions';
    else if (rScore >= 3 && fm >= 3) segment = 'Loyal Customers';
    else if (rScore >= 4 && fm <= 3) segment = 'Potential Loyalists';
    else if (rScore === 3 && fm <= 2) segment = 'Promising';
    else if (rScore === 2 && fm >= 2 && fm <= 3) segment = 'Need Attention';
    else if (rScore <= 2 && fm >= 4) segment = "Can't Lose Them";
    else if (rScore <= 2 && fm >= 2) segment = 'At Risk';

    const healthScore = Math.max(10, Math.min(99, Math.round((1 - churnProbability) * 100)));
    const tier = annualSpend >= 2500 ? 'Enterprise' : annualSpend >= 1000 ? 'Mid-Market' : 'Growth';
    const csOwner = membershipTier === 'VIP Gold / Pass' ? 'VIP Concierge Desk' : 'Automated Retention Engine';
    const lastLogin = new Date(2026, 9, 3 - recencyDays).toISOString().split('T')[0];

    const journeyEvents = recentOrders.slice(0, 4).map((ord, idx) => ({
      id: `evt-${ord.id}`,
      timestamp: ord.date,
      type: ord.status === 'Delayed' ? 'delivery_complaint' : 'purchase_delivered',
      title: ord.status === 'Delayed' ? `Late Delivery SLA Alert (${ord.deliveryTimeMins} mins)` : `Delivered Order #${ord.orderNumber}`,
      description: ord.status === 'Delayed' 
        ? `Customer logged an escalation: ${ord.complaintLogged || 'Delayed delivery'}. Rating: ${ord.rating} Star.`
        : `Delivered in ${ord.deliveryTimeMins} mins: ${ord.itemsSummary}. Amount: $${ord.amount}.`,
      sentiment: (ord.status === 'Delayed' ? 'negative' : 'positive') as any
    }));

    customers.push({
      id,
      code: `NX-${(10000 + i).toString()}`,
      name,
      email,
      domain: `${firstName.toLowerCase()}-consumer.com`,
      phone,
      city: cityLoc.city,
      area: cityLoc.area,
      region: cityLoc.region,
      country: cityLoc.country,
      coordinates: [lat, lng],
      membershipTier,
      preferredCategory: category,
      annualSpend,
      arr: annualSpend,
      monthlyAverageSpend,
      mrr: monthlyAverageSpend,
      monetary: annualSpend,
      frequency: lifetimeOrders,
      lifetimeOrders,
      avgBasketSize,
      avgOrderValue: avgBasketSize,
      recencyDays,
      ordersPast30Days,
      ordersPast90Days,
      activeAppDaysPast30,
      activeDays: activeAppDaysPast30,
      productDiversity: Math.floor(2 + random() * 5),
      cartAbandonmentCount,
      walletBalance,
      tier,
      industry: category,
      rfmR: rScore,
      rfmF: fScore,
      rfmM: mScore,
      rfmScore: `${rScore}${fScore}${mScore}`,
      segment,
      healthScore,
      churnProbability,
      riskLevel,
      primaryRiskReason,
      primaryRiskDriver: primaryRiskReason,
      riskFactors,
      shapAttributions,
      recommendedAction,
      retentionRecommendation: recommendedAction,
      recommendationRationale,
      incentiveOffer,
      suggestedChannel,
      estimatedRetentionUplift,
      csOwner,
      lastLogin,
      recentOrders,
      complaints,
      journeyEvents,
      joinedDate: new Date(2024, Math.floor(random() * 12), Math.floor(1 + random() * 28)).toISOString().split('T')[0]
    });
  }

  return customers;
}

// Generate Retention Tasks from Top High-Risk Customers
function generateRetentionTasks(customers: CustomerAccount[]): RetentionTask[] {
  const highRisk = customers
    .filter(c => c.riskLevel === 'High')
    .sort((a, b) => b.annualSpend - a.annualSpend)
    .slice(0, 16);

  const owners = [
    'CRM Growth Ops Desk',
    'VIP Customer Success Lead',
    'Quick Delivery Resolution Team',
    'Omnichannel Marketing Desk'
  ];

  return highRisk.map((c, idx) => {
    const hoursRemaining = Math.max(3, Math.floor(36 - idx * 2));
    const slaDeadline = new Date(Date.now() + hoursRemaining * 3600 * 1000).toISOString();

    return {
      id: `TASK-${300 + idx}`,
      customerId: c.id,
      customerName: c.name,
      customerSpend: c.annualSpend,
      customerArr: c.annualSpend,
      churnProbability: c.churnProbability,
      riskLevel: c.riskLevel,
      actionTitle: c.recommendedAction,
      offer: c.incentiveOffer,
      channel: c.suggestedChannel,
      rationale: c.recommendationRationale,
      priority: hoursRemaining <= 12 ? 'Urgent' : hoursRemaining <= 24 ? 'High' : 'Medium',
      owner: owners[idx % owners.length],
      slaDeadline,
      slaHoursRemaining: hoursRemaining,
      status: idx === 0 ? 'In Progress' : idx < 3 ? 'Pending' : idx < 6 ? 'Intervention Sent' : 'Pending'
    };
  });
}

// Compute Business Impact Metrics
export function getBusinessImpactMetrics(data: CustomerAccount[]): BusinessImpactMetrics {
  let totalAnnualGMV = 0;
  let highRiskCustomerCount = 0;
  let highRiskGmvExposure = 0;
  let totalChurnSum = 0;

  const categoryBreakdown: Record<CommerceCategory, { count: number; spend: number; atRiskCount: number }> = {
    'Quick Commerce & Groceries': { count: 0, spend: 0, atRiskCount: 0 },
    'Food & Dining Delivery': { count: 0, spend: 0, atRiskCount: 0 },
    'Daily Essentials & Home': { count: 0, spend: 0, atRiskCount: 0 },
    'Electronics & Gadgets': { count: 0, spend: 0, atRiskCount: 0 },
    'Fashion & Apparel': { count: 0, spend: 0, atRiskCount: 0 }
  };

  const tierBreakdown: Record<MembershipTier, { count: number; spend: number; atRiskCount: number }> = {
    'VIP Gold / Pass': { count: 0, spend: 0, atRiskCount: 0 },
    'Prime Member': { count: 0, spend: 0, atRiskCount: 0 },
    'Select Member': { count: 0, spend: 0, atRiskCount: 0 },
    'Standard': { count: 0, spend: 0, atRiskCount: 0 }
  };

  data.forEach(c => {
    totalAnnualGMV += c.annualSpend;
    totalChurnSum += c.churnProbability;

    if (c.riskLevel === 'High') {
      highRiskCustomerCount++;
      highRiskGmvExposure += c.annualSpend;
    }

    if (categoryBreakdown[c.preferredCategory]) {
      categoryBreakdown[c.preferredCategory].count++;
      categoryBreakdown[c.preferredCategory].spend += c.annualSpend;
      if (c.riskLevel === 'High') categoryBreakdown[c.preferredCategory].atRiskCount++;
    }

    if (tierBreakdown[c.membershipTier]) {
      tierBreakdown[c.membershipTier].count++;
      tierBreakdown[c.membershipTier].spend += c.annualSpend;
      if (c.riskLevel === 'High') tierBreakdown[c.membershipTier].atRiskCount++;
    }
  });

  // Potential recoverable GMV assumes ~74% historical recovery rate for targeted interventions
  const potentialRecoverableGmv = Math.round(highRiskGmvExposure * 0.74);
  const avgChurnRate = data.length ? +(totalChurnSum / data.length * 100).toFixed(1) : 0;

  return {
    totalCustomers: data.length,
    totalAnnualGMV,
    highRiskCustomerCount,
    highRiskGmvExposure,
    potentialRecoverableGmv,
    avgChurnRate,
    categoryBreakdown,
    tierBreakdown
  };
}

let cachedCustomers: CustomerAccount[] | null = null;
let cachedTasks: RetentionTask[] | null = null;

export function getCustomerDataset(): CustomerAccount[] {
  if (!cachedCustomers) {
    cachedCustomers = generateCommerceCustomers();
  }
  return cachedCustomers;
}

export function getRetentionTasks(): RetentionTask[] {
  if (!cachedTasks) {
    const custs = getCustomerDataset();
    cachedTasks = generateRetentionTasks(custs);
  }
  return cachedTasks;
}

export interface CockpitAggregations {
  totalAccounts: number;
  totalArr: number;
  atRiskArr: number;
  atRiskAccountsCount: number;
  avgHealthScore: number;
  avgChurnProbability: number;
  regionBreakdown: Record<Region, { count: number; arr: number; atRiskArr: number }>;
  segmentBreakdown: Record<any, { count: number; arr: number; avgHealth: number }>;
  riskBreakdown: Record<any, { count: number; arr: number }>;
  modelMetrics: {
    rocAuc: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    modelType: string;
    datasetSize: number;
  };
}
