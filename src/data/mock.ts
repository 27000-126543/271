import type {
  User, Pet, ServiceProvider, Product, Post, PetEvent,
  InsurancePlan, VaccinePlan, ServiceOrder, InsuranceClaim,
  DashboardStats, MemberBenefit
} from '@/types';

export const mockUser: User = {
  id: '1',
  username: '爱宠人士',
  phone: '138****8888',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20pet%20owner%20avatar&image_size=square',
  level: 'gold',
  points: 2580,
  annualSpending: 8560,
  activityScore: 92,
  address: '北京市朝阳区xxx小区',
  city: '北京'
};

export const mockPets: Pet[] = [
  {
    id: '1',
    userId: '1',
    name: '豆豆',
    type: 'dog',
    breed: '金毛寻回犬',
    age: 3,
    gender: 'male',
    weight: 28.5,
    personality: '活泼开朗，喜欢社交',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20retriever%20dog%20cute%20portrait&image_size=square',
    vaccineRecords: [
      { id: '1', name: '狂犬疫苗', date: '2026-01-15', nextDate: '2027-01-15', hospital: '宠物健康医院', status: 'completed' },
      { id: '2', name: '六联疫苗', date: '2026-02-20', nextDate: '2027-02-20', hospital: '宠物健康医院', status: 'completed' },
    ],
    medicalHistory: [
      { id: '1', date: '2025-08-10', hospital: '爱宠诊所', diagnosis: '轻微肠胃炎', treatment: '药物治疗', notes: '注意饮食卫生' }
    ]
  },
  {
    id: '2',
    userId: '1',
    name: '咪咪',
    type: 'cat',
    breed: '英国短毛猫',
    age: 2,
    gender: 'female',
    weight: 4.2,
    personality: '安静粘人，有点胆小',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=british%20shorthair%20cat%20cute%20portrait&image_size=square',
    vaccineRecords: [
      { id: '3', name: '猫三联', date: '2026-03-10', nextDate: '2027-03-10', hospital: '喵星医院', status: 'completed' },
    ],
    medicalHistory: []
  }
];

export const mockVaccinePlans: VaccinePlan[] = [
  { id: '1', petId: '1', name: '体内驱虫', type: 'deworming', recommendedDate: '2026-06-20', description: '建议每3个月进行一次体内驱虫', status: 'pending' },
  { id: '2', petId: '1', name: '年度体检', type: 'checkup', recommendedDate: '2026-07-15', description: '建议每年进行一次全面体检', status: 'pending' },
  { id: '3', petId: '2', name: '体外驱虫', type: 'deworming', recommendedDate: '2026-06-25', description: '建议每月进行一次体外驱虫', status: 'pending' },
];

export const mockServiceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: '爱宠生活馆',
    type: '综合',
    address: '北京市朝阳区建国路88号',
    distance: 0.8,
    rating: 4.8,
    reviewCount: 1256,
    busyLevel: 'medium',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20store%20logo%20cute&image_size=square',
    services: [
      { id: 's1', name: '精品洗澡', price: 88, duration: 60, description: '包含洗浴、吹干、梳理' },
      { id: 's2', name: '时尚造型', price: 188, duration: 120, description: '专业美容师修剪造型' },
      { id: 's3', name: '豪华寄养', price: 128, duration: 1440, description: '独立空间，每日遛弯' },
    ]
  },
  {
    id: '2',
    name: '萌宠训练中心',
    type: '训练',
    address: '北京市朝阳区望京街100号',
    distance: 1.5,
    rating: 4.9,
    reviewCount: 856,
    busyLevel: 'high',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20training%20center%20logo&image_size=square',
    services: [
      { id: 's4', name: '基础服从训练', price: 1980, duration: 600, description: '10节课，基础指令训练' },
      { id: 's5', name: '行为矫正', price: 2980, duration: 900, description: '针对不良行为进行矫正' },
    ]
  },
  {
    id: '3',
    name: '宠物摄影工作室',
    type: '摄影',
    address: '北京市朝阳区三里屯路50号',
    distance: 2.3,
    rating: 4.7,
    reviewCount: 423,
    busyLevel: 'low',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20photography%20studio%20logo&image_size=square',
    services: [
      { id: 's6', name: '萌宠写真', price: 399, duration: 180, description: '3套服装，20张精修' },
      { id: 's7', name: '全家福套餐', price: 699, duration: 240, description: '包含主人合影，30张精修' },
    ]
  }
];

export const mockServiceOrders: ServiceOrder[] = [
  {
    id: 'so1',
    userId: '1',
    petId: '1',
    providerId: '1',
    serviceId: 's3',
    serviceName: '豪华寄养',
    status: 'in_progress',
    appointmentTime: '2026-06-05 09:00',
    createTime: '2026-06-01 14:30',
    price: 640,
    dailyUpdates: [
      { id: 'du1', orderId: 'so1', date: '2026-06-05', images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20dog%20in%20pet%20hotel&image_size=square'], description: '豆豆今天状态很好，吃了两碗狗粮，下午和小伙伴玩得很开心！' },
      { id: 'du2', orderId: 'so1', date: '2026-06-06', images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20playing%20in%20garden&image_size=square'], description: '今天带豆豆去花园散步了，拍了好多美照~' },
    ]
  }
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '皇家成犬粮 10kg',
    category: 'food',
    price: 399,
    originalPrice: 499,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20dog%20food%20package&image_size=square',
    description: '适用于1-7岁成犬，营养均衡',
    stock: 156,
    sales: 2341,
    warehouse: '北京朝阳仓'
  },
  {
    id: 'p2',
    name: '渴望六种鱼猫粮 5.4kg',
    category: 'food',
    price: 568,
    originalPrice: 688,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20cat%20food%20package&image_size=square',
    description: '高蛋白猫粮，美毛护肤',
    stock: 89,
    sales: 1856,
    warehouse: '北京海淀仓'
  },
  {
    id: 'p3',
    name: '宠物自动喂食器',
    category: 'supplies',
    price: 299,
    originalPrice: 399,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=automatic%20pet%20feeder%20smart&image_size=square',
    description: '智能定时定量，APP远程控制',
    stock: 67,
    sales: 934,
    warehouse: '北京朝阳仓'
  },
  {
    id: 'p4',
    name: '狗狗耐咬玩具套装',
    category: 'toy',
    price: 69,
    originalPrice: 99,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20toys%20colorful%20set&image_size=square',
    description: '5件套，耐咬磨牙',
    stock: 234,
    sales: 3456,
    warehouse: '北京通州仓'
  },
  {
    id: 'p5',
    name: '猫爬架大型猫树',
    category: 'supplies',
    price: 459,
    originalPrice: 599,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20tree%20tower%20furniture&image_size=square',
    description: '多层设计，稳固耐用',
    stock: 45,
    sales: 567,
    warehouse: '北京朝阳仓'
  },
  {
    id: 'p6',
    name: '激光逗猫棒',
    category: 'toy',
    price: 29,
    originalPrice: 49,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laser%20cat%20toy%20pointer&image_size=square',
    description: 'USB充电，多图案切换',
    stock: 567,
    sales: 8765,
    warehouse: '北京海淀仓'
  }
];

export const mockPosts: Post[] = [
  {
    id: 'post1',
    userId: 'u2',
    username: '金毛麻麻',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=woman%20with%20golden%20retriever%20avatar&image_size=square',
    content: '今天带豆豆去公园玩，遇到了好多小伙伴！夏天到了，大家都出来遛狗啦~ 🐕☀️',
    images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dogs%20playing%20in%20park%20summer&image_size=square'],
    likes: 128,
    comments: 32,
    createTime: '2026-06-06 18:30',
    isLiked: false
  },
  {
    id: 'post2',
    userId: 'u3',
    username: '喵星人铲屎官',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20lover%20avatar&image_size=square',
    content: '我家咪咪今天终于学会用猫抓板了！老母亲感动落泪 😭 买了好几个，终于有一个它喜欢的了',
    images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20using%20scratching%20post&image_size=square'],
    likes: 256,
    comments: 48,
    createTime: '2026-06-06 14:20',
    isLiked: true
  },
  {
    id: 'post3',
    userId: 'u4',
    username: '宠物摄影师小王',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=photographer%20avatar&image_size=square',
    content: '今天拍的一组柯基写真，小短腿太可爱了！想给自家毛孩子拍照的可以约我哦~ 📸',
    images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=corgi%20dog%20professional%20photo&image_size=square'],
    likes: 512,
    comments: 89,
    createTime: '2026-06-05 20:15',
    isLiked: false
  }
];

export const mockEvents: PetEvent[] = [
  {
    id: 'e1',
    title: '周末宠物聚会',
    type: 'party',
    date: '2026-06-15 14:00',
    location: '朝阳公园宠物乐园',
    address: '北京市朝阳区朝阳公园南门',
    participants: 45,
    maxParticipants: 100,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20party%20dogs%20cats%20park&image_size=landscape_16_9',
    description: '周末带上你的毛孩子来参加聚会吧！认识更多小伙伴，还有小礼品赠送~',
    pointsReward: 50,
    isJoined: false
  },
  {
    id: 'e2',
    title: '狗狗运动会',
    type: 'competition',
    date: '2026-06-22 09:00',
    location: '奥体中心训练场',
    address: '北京市朝阳区奥体中心',
    participants: 78,
    maxParticipants: 200,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20sports%20competition%20race&image_size=landscape_16_9',
    description: '飞盘、障碍赛、接力跑...多项比赛等你来参加！获胜者有丰厚奖品',
    pointsReward: 100,
    isJoined: true
  },
  {
    id: 'e3',
    title: '流浪动物领养日',
    type: 'adoption',
    date: '2026-06-20 10:00',
    location: '万达广场',
    address: '北京市朝阳区万达广场1号门',
    participants: 120,
    maxParticipants: 300,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20adoption%20event%20stray%20animals&image_size=landscape_16_9',
    description: '给流浪的毛孩子一个家！现场有很多可爱的小猫小狗等待领养',
    pointsReward: 80,
    isJoined: false
  }
];

export const mockInsurancePlans: InsurancePlan[] = [
  {
    id: 'i1',
    name: '萌宠意外险',
    type: 'accident',
    price: 99,
    coverage: 10000,
    duration: 365,
    description: '保障宠物意外受伤、中毒等情况',
    features: ['意外身故/伤残赔付10000元', '意外医疗费用赔付5000元', '第三方责任险2000元']
  },
  {
    id: 'i2',
    name: '宠物医疗险',
    type: 'medical',
    price: 299,
    coverage: 30000,
    duration: 365,
    description: '覆盖常见疾病治疗费用',
    features: ['疾病住院医疗赔付30000元', '门诊费用赔付5000元', '手术费用全额赔付', '全国多家医院直赔']
  },
  {
    id: 'i3',
    name: '全能保障计划',
    type: 'medical',
    price: 599,
    coverage: 80000,
    duration: 365,
    description: '全方位保障，意外+疾病全覆盖',
    features: ['意外身故/伤残赔付50000元', '疾病医疗赔付80000元', '24小时在线兽医咨询', '专属健康档案管理']
  }
];

export const mockClaims: InsuranceClaim[] = [
  {
    id: 'c1',
    userId: '1',
    petId: '1',
    planId: 'i2',
    planName: '宠物医疗险',
    status: 'approved',
    amount: 1280,
    description: '豆豆肠胃炎治疗费用',
    images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20bill%20invoice&image_size=square'],
    createTime: '2026-05-10',
    reviewNotes: '审核通过，理赔金额已到账'
  },
  {
    id: 'c2',
    userId: '1',
    petId: '2',
    planId: 'i1',
    planName: '萌宠意外险',
    status: 'reviewing',
    amount: 560,
    description: '咪咪爪子受伤治疗',
    images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=veterinary%20receipt%20document&image_size=square'],
    createTime: '2026-06-05'
  }
];

export const mockMemberBenefits: MemberBenefit[] = [
  { id: 'b1', level: 'normal', name: '注册礼包', description: '新用户注册即送100积分', icon: 'Gift' },
  { id: 'b2', level: 'silver', name: '9.5折优惠', description: '全场商品9.5折', icon: 'Percent' },
  { id: 'b3', level: 'silver', name: '免费洗澡', description: '每年2次免费洗澡服务', icon: 'Bath' },
  { id: 'b4', level: 'gold', name: '9折优惠', description: '全场商品9折', icon: 'Percent' },
  { id: 'b5', level: 'gold', name: '优先预约', description: '服务预约优先安排', icon: 'Clock' },
  { id: 'b6', level: 'gold', name: '免费体检', description: '每年1次免费体检', icon: 'Heart' },
  { id: 'b7', level: 'diamond', name: '8.5折优惠', description: '全场商品8.5折', icon: 'Percent' },
  { id: 'b8', level: 'diamond', name: '专属客服', description: '1对1专属客服服务', icon: 'Headphones' },
  { id: 'b9', level: 'diamond', name: '生日礼包', description: '生日当月赠送大礼包', icon: 'Cake' },
];

export const mockDashboardStats: DashboardStats = {
  totalOrders: 12580,
  totalSales: 2580000,
  totalClaims: 342,
  eventParticipationRate: 68.5,
  memberActivity: 75.2,
  orderTrend: [
    { date: '1月', value: 980 },
    { date: '2月', value: 1050 },
    { date: '3月', value: 1120 },
    { date: '4月', value: 1280 },
    { date: '5月', value: 1350 },
    { date: '6月', value: 1520 },
  ],
  salesTrend: [
    { date: '1月', value: 180000 },
    { date: '2月', value: 210000 },
    { date: '3月', value: 240000 },
    { date: '4月', value: 280000 },
    { date: '5月', value: 320000 },
    { date: '6月', value: 380000 },
  ],
  categorySales: [
    { name: '宠物食品', value: 1200000 },
    { name: '宠物用品', value: 680000 },
    { name: '服务订单', value: 450000 },
    { name: '保险产品', value: 250000 },
  ],
  serviceSatisfaction: [
    { service: '洗澡美容', score: 4.8 },
    { service: '宠物寄养', score: 4.7 },
    { service: '宠物训练', score: 4.9 },
    { service: '宠物摄影', score: 4.6 },
  ],
  userGrowth: [
    { date: '1月', value: 500 },
    { date: '2月', value: 620 },
    { date: '3月', value: 780 },
    { date: '4月', value: 920 },
    { date: '5月', value: 1050 },
    { date: '6月', value: 1280 },
  ],
  claimRate: 12.5,
  predictions: [
    { name: '夏季防暑用品', category: '用品', predictedGrowth: 45, suggestion: '建议增加库存，推出防暑套餐' },
    { name: '宠物游泳服务', category: '服务', predictedGrowth: 38, suggestion: '建议增加场次，提前开放预约' },
    { name: '进口天然粮', category: '食品', predictedGrowth: 25, suggestion: '建议开展促销活动，提升销量' },
  ]
};
