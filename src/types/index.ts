export interface User {
  id: string;
  username: string;
  phone: string;
  avatar: string;
  level: 'normal' | 'silver' | 'gold' | 'diamond';
  points: number;
  annualSpending: number;
  activityScore: number;
  address: string;
  city: string;
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  personality: string;
  avatar: string;
  vaccineRecords: VaccineRecord[];
  medicalHistory: MedicalRecord[];
}

export interface VaccineRecord {
  id: string;
  name: string;
  date: string;
  nextDate: string;
  hospital: string;
  status: 'completed' | 'upcoming' | 'overdue';
}

export interface MedicalRecord {
  id: string;
  date: string;
  hospital: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

export interface VaccinePlan {
  id: string;
  petId: string;
  name: string;
  type: 'vaccine' | 'deworming' | 'checkup';
  recommendedDate: string;
  description: string;
  status: 'pending' | 'completed';
}

export interface ServiceProvider {
  id: string;
  name: string;
  type: string;
  address: string;
  distance: number;
  rating: number;
  reviewCount: number;
  busyLevel: 'low' | 'medium' | 'high';
  avatar: string;
  services: ServiceItem[];
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

export interface ServiceOrder {
  id: string;
  userId: string;
  petId: string;
  providerId: string;
  serviceId: string;
  serviceName: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  appointmentTime: string;
  createTime: string;
  price: number;
  dailyUpdates?: DailyUpdate[];
}

export interface DailyUpdate {
  id: string;
  orderId: string;
  date: string;
  images: string[];
  videos?: string[];
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'food' | 'supplies' | 'toy';
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  stock: number;
  sales: number;
  warehouse: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createTime: string;
  address: string;
  logistics: LogisticsInfo;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface LogisticsInfo {
  status: string;
  currentLocation: string;
  updates: LogisticsUpdate[];
}

export interface LogisticsUpdate {
  time: string;
  location: string;
  description: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  createTime: string;
  isLiked: boolean;
}

export interface PetEvent {
  id: string;
  title: string;
  type: 'party' | 'competition' | 'training' | 'adoption';
  date: string;
  location: string;
  address: string;
  participants: number;
  maxParticipants: number;
  image: string;
  description: string;
  pointsReward: number;
  isJoined: boolean;
}

export interface InsurancePlan {
  id: string;
  name: string;
  type: 'accident' | 'medical';
  price: number;
  coverage: number;
  duration: number;
  description: string;
  features: string[];
}

export interface InsuranceClaim {
  id: string;
  userId: string;
  petId: string;
  planId: string;
  planName: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  amount: number;
  description: string;
  images: string[];
  createTime: string;
  reviewNotes?: string;
}

export interface MemberBenefit {
  id: string;
  level: 'normal' | 'silver' | 'gold' | 'diamond';
  name: string;
  description: string;
  icon: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalSales: number;
  totalClaims: number;
  eventParticipationRate: number;
  memberActivity: number;
  orderTrend: TrendItem[];
  salesTrend: TrendItem[];
  categorySales: CategoryItem[];
  serviceSatisfaction: SatisfactionItem[];
  userGrowth: TrendItem[];
  claimRate: number;
  predictions: PredictionItem[];
}

export interface TrendItem {
  date: string;
  value: number;
}

export interface CategoryItem {
  name: string;
  value: number;
}

export interface SatisfactionItem {
  service: string;
  score: number;
}

export interface PredictionItem {
  name: string;
  category: string;
  predictedGrowth: number;
  suggestion: string;
}

export interface MonthlyReport {
  month: string;
  revenueByCategory: CategoryItem[];
  serviceSatisfaction: SatisfactionItem[];
  claimRate: number;
  userGrowth: number;
  totalRevenue: number;
}
