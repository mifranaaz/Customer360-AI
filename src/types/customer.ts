/**
 * Customer360 AI Nexus - Consumer & Enterprise Commerce Intelligence Types
 * Grounded in E-Commerce, Quick-Commerce, Food Delivery & Retail Platforms
 */

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type Region = 'North America' | 'EMEA' | 'APAC' | 'LATAM';

export type CommerceCategory = 
  | 'Quick Commerce & Groceries' 
  | 'Electronics & Gadgets' 
  | 'Food & Dining Delivery' 
  | 'Fashion & Apparel' 
  | 'Daily Essentials & Home';

export type MembershipTier = 'VIP Gold / Pass' | 'Prime Member' | 'Select Member' | 'Standard';

export type CustomerSegment = 
  | 'Champions'
  | 'Loyal Customers'
  | 'Potential Loyalists'
  | 'Promising'
  | 'Need Attention'
  | 'At Risk'
  | 'Can\'t Lose Them'
  | 'Hibernating';

export interface OrderItem {
  id: string;
  date: string;
  orderNumber: string;
  category: CommerceCategory;
  itemsSummary: string;
  amount: number;
  deliveryTimeMins: number;
  status: 'Delivered' | 'Returned' | 'Cancelled' | 'Delayed';
  rating: number; // 1 to 5 stars
  complaintLogged?: string;
}

export interface CustomerComplaint {
  id: string;
  date: string;
  category: 'Late Delivery' | 'Damaged/Missing Item' | 'Payment/Refund Delay' | 'Food Quality' | 'App Glitch';
  description: string;
  resolutionStatus: 'Resolved with Credit' | 'Pending Review' | 'Closed' | 'Escalated';
  sentiment: 'Frustrated' | 'Neutral' | 'Dissatisfied';
}

export interface ShapFeatureAttribution {
  feature: string;
  displayLabel: string;
  actualValue: string | number;
  shapValue: number;
  isRiskDriver: boolean;
}

export interface CustomerAccount {
  id: string;
  name: string;
  code: string;
  email: string;
  domain: string;
  phone: string;
  city: string;
  area: string;
  region: Region;
  country: string;
  coordinates: [number, number]; // [lat, lng]
  membershipTier: MembershipTier;
  preferredCategory: CommerceCategory;
  
  // Financial & Order Vitals
  annualSpend: number; // Total spend in USD
  arr: number; // Aliased to annualSpend
  monthlyAverageSpend: number;
  mrr: number; // Aliased to monthlyAverageSpend
  monetary: number; // Lifetime spend
  frequency: number; // Order frequency
  lifetimeOrders: number;
  avgBasketSize: number; // Average Order Value (AOV)
  avgOrderValue: number; // Aliased
  recencyDays: number; // Days since last order
  ordersPast30Days: number;
  ordersPast90Days: number;
  activeAppDaysPast30: number;
  activeDays: number; // Aliased
  productDiversity: number;
  cartAbandonmentCount: number;
  walletBalance: number;
  tier: 'Enterprise' | 'Mid-Market' | 'Growth';
  industry: string;

  // RFM & Health Vitals
  rfmR: number; // 1 to 5
  rfmF: number; // 1 to 5
  rfmM: number; // 1 to 5
  rfmScore: string;
  segment: CustomerSegment;
  healthScore: number; // 0 to 100

  // Churn Risk & AI Explainability
  churnProbability: number; // 0.00 to 1.00
  riskLevel: RiskLevel;
  primaryRiskReason: string; // The explicit "WHY" they are at risk
  primaryRiskDriver: string; // Aliased
  riskFactors: string[];
  shapAttributions: ShapFeatureAttribution[];

  // AI Retention Action Plan
  recommendedAction: string;
  retentionRecommendation: string; // Aliased
  recommendationRationale: string; // The explicit "WHY" for this recommendation
  incentiveOffer: string;
  suggestedChannel: 'Push Notification' | 'WhatsApp Direct' | 'In-App Banner' | 'Email VIP Outreach';
  estimatedRetentionUplift: string;
  csOwner: string;
  lastLogin: string;

  // History logs
  recentOrders: OrderItem[];
  complaints: CustomerComplaint[];
  journeyEvents: Array<{
    id: string;
    timestamp: string;
    type: string;
    title: string;
    description: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>;
  joinedDate: string;
}

export interface RetentionTask {
  id: string;
  customerId: string;
  customerName: string;
  customerSpend: number;
  customerArr: number;
  churnProbability: number;
  riskLevel: RiskLevel;
  actionTitle: string;
  offer: string;
  channel: string;
  rationale: string;
  priority: 'Urgent' | 'High' | 'Medium';
  owner: string;
  slaDeadline: string;
  slaHoursRemaining: number;
  status: 'Pending' | 'In Progress' | 'Intervention Sent' | 'Resolved';
}

export interface BusinessImpactMetrics {
  totalCustomers: number;
  totalAnnualGMV: number;
  highRiskCustomerCount: number;
  highRiskGmvExposure: number;
  potentialRecoverableGmv: number;
  avgChurnRate: number;
  categoryBreakdown: Record<CommerceCategory, { count: number; spend: number; atRiskCount: number }>;
  tierBreakdown: Record<MembershipTier, { count: number; spend: number; atRiskCount: number }>;
}

export type UserPersona = 'CRO / Executive' | 'Customer Success Lead' | 'Retention Specialist' | 'Data Analyst';
