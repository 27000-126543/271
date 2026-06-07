import { data, saveDB } from '../database/db.js';
import bcrypt from 'bcryptjs';

async function initDatabase() {
  console.log('🚀 开始初始化数据库...');

  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    data.users = [
      {
        id: 1,
        username: '爱宠人士',
        phone: '13800138000',
        password: hashedPassword,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20pet%20owner%20avatar&image_size=square',
        level: 'gold',
        points: 2580,
        annual_spending: 8560,
        activity_score: 92,
        address: '北京市朝阳区xxx小区',
        city: '北京',
        created_at: new Date().toISOString()
      }
    ];

    data.pets = [
      {
        id: 1,
        user_id: 1,
        name: '豆豆',
        type: 'dog',
        breed: '金毛寻回犬',
        age: 3,
        gender: 'male',
        weight: 28.5,
        personality: '活泼开朗，喜欢社交',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20retriever%20dog%20cute%20portrait&image_size=square',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        user_id: 1,
        name: '咪咪',
        type: 'cat',
        breed: '英国短毛猫',
        age: 2,
        gender: 'female',
        weight: 4.2,
        personality: '安静粘人，有点胆小',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=british%20shorthair%20cat%20cute%20portrait&image_size=square',
        created_at: new Date().toISOString()
      }
    ];

    data.vaccine_records = [
      { id: 1, pet_id: 1, name: '狂犬疫苗', date: '2026-01-15', next_date: '2027-01-15', hospital: '宠物健康医院', status: 'completed', created_at: new Date().toISOString() },
      { id: 2, pet_id: 1, name: '六联疫苗', date: '2026-02-20', next_date: '2027-02-20', hospital: '宠物健康医院', status: 'completed', created_at: new Date().toISOString() },
      { id: 3, pet_id: 2, name: '猫三联', date: '2026-03-10', next_date: '2027-03-10', hospital: '喵星医院', status: 'completed', created_at: new Date().toISOString() }
    ];

    data.medical_records = [
      { id: 1, pet_id: 1, date: '2025-08-10', hospital: '爱宠诊所', diagnosis: '轻微肠胃炎', treatment: '药物治疗', notes: '注意饮食卫生', created_at: new Date().toISOString() }
    ];

    data.service_providers = [
      { id: 1, name: '爱宠生活馆', type: '综合', address: '北京市朝阳区建国路88号', distance: 0.8, rating: 4.8, review_count: 1256, busy_level: 'medium', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20store%20logo%20cute&image_size=square', city: '北京', created_at: new Date().toISOString() },
      { id: 2, name: '萌宠训练中心', type: '训练', address: '北京市朝阳区望京街100号', distance: 1.5, rating: 4.9, review_count: 856, busy_level: 'high', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20training%20center%20logo&image_size=square', city: '北京', created_at: new Date().toISOString() },
      { id: 3, name: '宠物摄影工作室', type: '摄影', address: '北京市朝阳区三里屯路50号', distance: 2.3, rating: 4.7, review_count: 423, busy_level: 'low', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20photography%20studio%20logo&image_size=square', city: '北京', created_at: new Date().toISOString() }
    ];

    data.service_items = [
      { id: 1, provider_id: 1, name: '精品洗澡', price: 88, duration: 60, description: '包含洗浴、吹干、梳理', created_at: new Date().toISOString() },
      { id: 2, provider_id: 1, name: '时尚造型', price: 188, duration: 120, description: '专业美容师修剪造型', created_at: new Date().toISOString() },
      { id: 3, provider_id: 1, name: '豪华寄养', price: 128, duration: 1440, description: '独立空间，每日遛弯', created_at: new Date().toISOString() },
      { id: 4, provider_id: 2, name: '基础服从训练', price: 1980, duration: 600, description: '10节课，基础指令训练', created_at: new Date().toISOString() },
      { id: 5, provider_id: 2, name: '行为矫正', price: 2980, duration: 900, description: '针对不良行为进行矫正', created_at: new Date().toISOString() },
      { id: 6, provider_id: 3, name: '萌宠写真', price: 399, duration: 180, description: '3套服装，20张精修', created_at: new Date().toISOString() },
      { id: 7, provider_id: 3, name: '全家福套餐', price: 699, duration: 240, description: '包含主人合影，30张精修', created_at: new Date().toISOString() }
    ];

    data.service_orders = [
      { id: 1, user_id: 1, pet_id: 1, provider_id: 1, service_id: 3, service_name: '豪华寄养', status: 'in_progress', appointment_time: '2026-06-05 09:00', price: 640, created_at: new Date().toISOString() }
    ];

    data.daily_updates = [
      { id: 1, order_id: 1, date: '2026-06-05', images: '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20dog%20in%20pet%20hotel&image_size=square"]', videos: '[]', description: '豆豆今天状态很好，吃了两碗狗粮，下午和小伙伴玩得很开心！', created_at: new Date().toISOString() },
      { id: 2, order_id: 1, date: '2026-06-06', images: '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20playing%20in%20garden&image_size=square"]', videos: '[]', description: '今天带豆豆去花园散步了，拍了好多美照~', created_at: new Date().toISOString() }
    ];

    data.products = [
      { id: 1, name: '皇家成犬粮 10kg', category: 'food', price: 399, original_price: 499, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20food%20package&image_size=square', description: '适用于1-7岁成犬，营养均衡', stock: 156, sales: 2341, warehouse: '北京朝阳仓', created_at: new Date().toISOString() },
      { id: 2, name: '渴望六种鱼猫粮 5.4kg', category: 'food', price: 568, original_price: 688, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20food%20package&image_size=square', description: '高蛋白猫粮，美毛护肤', stock: 89, sales: 1856, warehouse: '北京海淀仓', created_at: new Date().toISOString() },
      { id: 3, name: '宠物自动喂食器', category: 'supplies', price: 299, original_price: 399, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=automatic%20pet%20feeder&image_size=square', description: '智能定时定量，APP远程控制', stock: 67, sales: 934, warehouse: '北京朝阳仓', created_at: new Date().toISOString() },
      { id: 4, name: '狗狗耐咬玩具套装', category: 'toy', price: 69, original_price: 99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20toys%20colorful%20set&image_size=square', description: '5件套，耐咬磨牙', stock: 234, sales: 3456, warehouse: '北京通州仓', created_at: new Date().toISOString() },
      { id: 5, name: '猫爬架大型猫树', category: 'supplies', price: 459, original_price: 599, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20tree%20tower&image_size=square', description: '多层设计，稳固耐用', stock: 45, sales: 567, warehouse: '北京朝阳仓', created_at: new Date().toISOString() },
      { id: 6, name: '激光逗猫棒', category: 'toy', price: 29, original_price: 49, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laser%20cat%20toy%20pointer&image_size=square', description: 'USB充电，多图案切换', stock: 567, sales: 8765, warehouse: '北京海淀仓', created_at: new Date().toISOString() }
    ];

    data.posts = [
      { id: 1, user_id: 1, content: '今天带豆豆去公园玩，遇到了好多小伙伴！夏天到了，大家都出来遛狗啦~ 🐕☀️', images: '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dogs%20playing%20in%20park%20summer&image_size=square"]', likes: 128, comments: 32, created_at: new Date().toISOString() },
      { id: 2, user_id: 1, content: '我家咪咪今天终于学会用猫抓板了！老母亲感动落泪 😭 买了好几个，终于有一个它喜欢的了', images: '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20using%20scratching%20post&image_size=square"]', likes: 256, comments: 48, created_at: new Date().toISOString() }
    ];

    data.events = [
      { id: 1, title: '周末宠物聚会', type: 'party', date: '2026-06-15 14:00', location: '朝阳公园宠物乐园', address: '北京市朝阳区朝阳公园南门', participants: 45, max_participants: 100, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20party%20dogs%20park&image_size=landscape_16_9', description: '周末带上你的毛孩子来参加聚会吧！认识更多小伙伴，还有小礼品赠送~', points_reward: 50, city: '北京', created_at: new Date().toISOString() },
      { id: 2, title: '狗狗运动会', type: 'competition', date: '2026-06-22 09:00', location: '奥体中心训练场', address: '北京市朝阳区奥体中心', participants: 78, max_participants: 200, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20sports%20competition&image_size=landscape_16_9', description: '飞盘、障碍赛、接力跑...多项比赛等你来参加！获胜者有丰厚奖品', points_reward: 100, city: '北京', created_at: new Date().toISOString() },
      { id: 3, title: '流浪动物领养日', type: 'adoption', date: '2026-06-20 10:00', location: '万达广场', address: '北京市朝阳区万达广场1号门', participants: 120, max_participants: 300, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20adoption%20event&image_size=landscape_16_9', description: '给流浪的毛孩子一个家！现场有很多可爱的小猫小狗等待领养', points_reward: 80, city: '北京', created_at: new Date().toISOString() }
    ];

    data.insurance_plans = [
      { id: 1, name: '萌宠意外险', type: 'accident', price: 99, coverage: 10000, duration: 365, description: '保障宠物意外受伤、中毒等情况', features: '["意外身故/伤残赔付10000元","意外医疗费用赔付5000元","第三方责任险2000元"]', created_at: new Date().toISOString() },
      { id: 2, name: '宠物医疗险', type: 'medical', price: 299, coverage: 30000, duration: 365, description: '覆盖常见疾病治疗费用', features: '["疾病住院医疗赔付30000元","门诊费用赔付5000元","手术费用全额赔付","全国多家医院直赔"]', created_at: new Date().toISOString() },
      { id: 3, name: '全能保障计划', type: 'medical', price: 599, coverage: 80000, duration: 365, description: '全方位保障，意外+疾病全覆盖', features: '["意外身故/伤残赔付50000元","疾病医疗赔付80000元","24小时在线兽医咨询","专属健康档案管理"]', created_at: new Date().toISOString() }
    ];

    data.insurance_claims = [
      { id: 1, user_id: 1, pet_id: 1, plan_id: 2, plan_name: '宠物医疗险', status: 'approved', amount: 1280, description: '豆豆肠胃炎治疗费用', images: '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20bill%20invoice&image_size=square"]', review_notes: '审核通过，理赔金额已到账', created_at: '2026-05-10' },
      { id: 2, user_id: 1, pet_id: 2, plan_id: 1, plan_name: '萌宠意外险', status: 'reviewing', amount: 560, description: '咪咪爪子受伤治疗', images: '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=veterinary%20receipt&image_size=square"]', review_notes: null, created_at: '2026-06-05' }
    ];

    data.member_benefits = [
      { id: 1, level: 'normal', name: '注册礼包', description: '新用户注册即送100积分', icon: 'Gift', created_at: new Date().toISOString() },
      { id: 2, level: 'silver', name: '9.5折优惠', description: '全场商品9.5折', icon: 'Percent', created_at: new Date().toISOString() },
      { id: 3, level: 'silver', name: '免费洗澡', description: '每年2次免费洗澡服务', icon: 'Bath', created_at: new Date().toISOString() },
      { id: 4, level: 'gold', name: '9折优惠', description: '全场商品9折', icon: 'Percent', created_at: new Date().toISOString() },
      { id: 5, level: 'gold', name: '优先预约', description: '服务预约优先安排', icon: 'Clock', created_at: new Date().toISOString() },
      { id: 6, level: 'gold', name: '免费体检', description: '每年1次免费体检', icon: 'Heart', created_at: new Date().toISOString() },
      { id: 7, level: 'diamond', name: '8.5折优惠', description: '全场商品8.5折', icon: 'Percent', created_at: new Date().toISOString() },
      { id: 8, level: 'diamond', name: '专属客服', description: '1对1专属客服服务', icon: 'Headphones', created_at: new Date().toISOString() },
      { id: 9, level: 'diamond', name: '生日礼包', description: '生日当月赠送大礼包', icon: 'Cake', created_at: new Date().toISOString() }
    ];

    data.counters = {
      users: 1,
      pets: 2,
      vaccine_records: 3,
      medical_records: 1,
      service_providers: 3,
      service_items: 7,
      service_orders: 1,
      daily_updates: 2,
      products: 6,
      posts: 2,
      events: 3,
      insurance_plans: 3,
      insurance_claims: 2,
      member_benefits: 9
    };

    saveDB();

    console.log('\n✅ 数据库初始化完成！');
    console.log('📱 测试账号: 13800138000 / 123456');
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();
