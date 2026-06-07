import { run } from '../database/db.js';
import bcrypt from 'bcryptjs';

async function initDatabase() {
  console.log('🚀 开始初始化数据库...');

  try {
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT DEFAULT '',
        level TEXT DEFAULT 'normal',
        points INTEGER DEFAULT 0,
        annual_spending REAL DEFAULT 0,
        activity_score INTEGER DEFAULT 0,
        address TEXT DEFAULT '',
        city TEXT DEFAULT '北京',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ users表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        breed TEXT NOT NULL,
        age INTEGER DEFAULT 0,
        gender TEXT DEFAULT 'male',
        weight REAL DEFAULT 0,
        personality TEXT DEFAULT '',
        avatar TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ pets表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS vaccine_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        date DATE NOT NULL,
        next_date DATE,
        hospital TEXT DEFAULT '',
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ vaccine_records表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS medical_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER NOT NULL,
        date DATE NOT NULL,
        hospital TEXT DEFAULT '',
        diagnosis TEXT NOT NULL,
        treatment TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ medical_records表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS service_providers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT DEFAULT '',
        address TEXT DEFAULT '',
        distance REAL DEFAULT 0,
        rating REAL DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        busy_level TEXT DEFAULT 'medium',
        avatar TEXT DEFAULT '',
        city TEXT DEFAULT '北京',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ service_providers表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS service_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        duration INTEGER DEFAULT 0,
        description TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ service_items表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS service_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        pet_id INTEGER NOT NULL,
        provider_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        service_name TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        appointment_time DATETIME NOT NULL,
        price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (pet_id) REFERENCES pets(id),
        FOREIGN KEY (provider_id) REFERENCES service_providers(id)
      )
    `);
    console.log('✅ service_orders表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS daily_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        date DATE NOT NULL,
        images TEXT DEFAULT '[]',
        videos TEXT DEFAULT '[]',
        description TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES service_orders(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ daily_updates表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        original_price REAL NOT NULL,
        image TEXT DEFAULT '',
        description TEXT DEFAULT '',
        stock INTEGER DEFAULT 0,
        sales INTEGER DEFAULT 0,
        warehouse TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ products表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        address TEXT DEFAULT '',
        logistics_status TEXT DEFAULT 'pending',
        current_location TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ orders表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        price REAL NOT NULL,
        image TEXT DEFAULT '',
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
    console.log('✅ order_items表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        images TEXT DEFAULT '[]',
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ posts表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ post_likes表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT DEFAULT 'party',
        date DATETIME NOT NULL,
        location TEXT DEFAULT '',
        address TEXT DEFAULT '',
        participants INTEGER DEFAULT 0,
        max_participants INTEGER DEFAULT 100,
        image TEXT DEFAULT '',
        description TEXT DEFAULT '',
        points_reward INTEGER DEFAULT 0,
        city TEXT DEFAULT '北京',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ events表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS event_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        checked_in INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id),
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ event_participants表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS insurance_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT DEFAULT 'medical',
        price REAL NOT NULL,
        coverage REAL NOT NULL,
        duration INTEGER DEFAULT 365,
        description TEXT DEFAULT '',
        features TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ insurance_plans表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS insurance_claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        pet_id INTEGER NOT NULL,
        plan_id INTEGER NOT NULL,
        plan_name TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        amount REAL NOT NULL,
        description TEXT DEFAULT '',
        images TEXT DEFAULT '[]',
        review_notes TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (pet_id) REFERENCES pets(id),
        FOREIGN KEY (plan_id) REFERENCES insurance_plans(id)
      )
    `);
    console.log('✅ insurance_claims表创建成功');

    await run(`
      CREATE TABLE IF NOT EXISTS member_benefits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        icon TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ member_benefits表创建成功');

    console.log('\n📝 开始插入初始数据...');

    const hashedPassword = await bcrypt.hash('123456', 10);
    
    await run(
      `INSERT INTO users (username, phone, password, avatar, level, points, annual_spending, activity_score, address, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['爱宠人士', '13800138000', hashedPassword, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20pet%20owner%20avatar&image_size=square', 'gold', 2580, 8560, 92, '北京市朝阳区xxx小区', '北京']
    );
    console.log('✅ 测试用户创建成功 (用户名: 13800138000, 密码: 123456');

    await run(
      `INSERT INTO pets (user_id, name, type, breed, age, gender, weight, personality, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, '豆豆', 'dog', '金毛寻回犬', 3, 'male', 28.5, '活泼开朗，喜欢社交', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20retriever%20dog%20cute%20portrait&image_size=square']
    );
    await run(
      `INSERT INTO pets (user_id, name, type, breed, age, gender, weight, personality, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, '咪咪', 'cat', '英国短毛猫', 2, 'female', 4.2, '安静粘人，有点胆小', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=british%20shorthair%20cat%20cute%20portrait&image_size=square']
    );
    console.log('✅ 测试宠物数据插入成功');

    await run(
      `INSERT INTO vaccine_records (pet_id, name, date, next_date, hospital, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [1, '狂犬疫苗', '2026-01-15', '2027-01-15', '宠物健康医院', 'completed']
    );
    await run(
      `INSERT INTO vaccine_records (pet_id, name, date, next_date, hospital, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [1, '六联疫苗', '2026-02-20', '2027-02-20', '宠物健康医院', 'completed']
    );
    await run(
      `INSERT INTO vaccine_records (pet_id, name, date, next_date, hospital, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [2, '猫三联', '2026-03-10', '2027-03-10', '喵星医院', 'completed']
    );
    console.log('✅ 疫苗记录数据插入成功');

    await run(
      `INSERT INTO medical_records (pet_id, date, hospital, diagnosis, treatment, notes) VALUES (?, ?, ?, ?, ?, ?)`,
      [1, '2025-08-10', '爱宠诊所', '轻微肠胃炎', '药物治疗', '注意饮食卫生']
    );
    console.log('✅ 病史记录数据插入成功');

    const providers = [
      { name: '爱宠生活馆', type: '综合', address: '北京市朝阳区建国路88号', distance: 0.8, rating: 4.8, review_count: 1256, busy_level: 'medium', city: '北京' },
      { name: '萌宠训练中心', type: '训练', address: '北京市朝阳区望京街100号', distance: 1.5, rating: 4.9, review_count: 856, busy_level: 'high', city: '北京' },
      { name: '宠物摄影工作室', type: '摄影', address: '北京市朝阳区三里屯路50号', distance: 2.3, rating: 4.7, review_count: 423, busy_level: 'low', city: '北京' },
    ];
    for (const p of providers) {
      await run(
        `INSERT INTO service_providers (name, type, address, distance, rating, review_count, busy_level, avatar, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.type, p.address, p.distance, p.rating, p.review_count, p.busy_level, `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20store%20logo%20cute&image_size=square', p.city]
      );
    }
    console.log('✅ 服务商数据插入成功');

    const serviceItems = [
      { providerId: 1, name: '精品洗澡', price: 88, duration: 60, description: '包含洗浴、吹干、梳理' },
      { providerId: 1, name: '时尚造型', price: 188, duration: 120, description: '专业美容师修剪造型' },
      { providerId: 1, name: '豪华寄养', price: 128, duration: 1440, description: '独立空间，每日遛弯' },
      { providerId: 2, name: '基础服从训练', price: 1980, duration: 600, description: '10节课，基础指令训练' },
      { providerId: 2, name: '行为矫正', price: 2980, duration: 900, description: '针对不良行为进行矫正' },
      { providerId: 3, name: '萌宠写真', price: 399, duration: 180, description: '3套服装，20张精修' },
      { providerId: 3, name: '全家福套餐', price: 699, duration: 240, description: '包含主人合影，30张精修' },
    ];
    for (const item of serviceItems) {
      await run(
        `INSERT INTO service_items (provider_id, name, price, duration, description) VALUES (?, ?, ?, ?, ?)`,
        [item.providerId, item.name, item.price, item.duration, item.description]
      );
    }
    console.log('✅ 服务项目数据插入成功');

    await run(
      `INSERT INTO service_orders (user_id, pet_id, provider_id, service_id, service_name, status, appointment_time, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, 1, 1, 3, '豪华寄养', 'in_progress', '2026-06-05 09:00', 640]
    );
    console.log('✅ 服务订单数据插入成功');

    await run(
      `INSERT INTO daily_updates (order_id, date, images, description) VALUES (?, ?, ?, ?)`,
      [1, '2026-06-05', '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20dog%20in%20pet%20hotel&image_size=square"]', '豆豆今天状态很好，吃了两碗狗粮，下午和小伙伴玩得很开心！']
    );
    await run(
      `INSERT INTO daily_updates (order_id, date, images, description) VALUES (?, ?, ?, ?)`,
      [1, '2026-06-06', '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20playing%20in%20garden&image_size=square"]', '今天带豆豆去花园散步了，拍了好多美照~']
    );
    console.log('✅ 寄养日常动态数据插入成功');

    const products = [
      { name: '皇家成犬粮 10kg', category: 'food', price: 399, original_price: 499, description: '适用于1-7岁成犬，营养均衡', stock: 156, sales: 2341, warehouse: '北京朝阳仓' },
      { name: '渴望六种鱼猫粮 5.4kg', category: 'food', price: 568, original_price: 688, description: '高蛋白猫粮，美毛护肤', stock: 89, sales: 1856, warehouse: '北京海淀仓' },
      { name: '宠物自动喂食器', category: 'supplies', price: 299, original_price: 399, description: '智能定时定量，APP远程控制', stock: 67, sales: 934, warehouse: '北京朝阳仓' },
      { name: '狗狗耐咬玩具套装', category: 'toy', price: 69, original_price: 99, description: '5件套，耐咬磨牙', stock: 234, sales: 3456, warehouse: '北京通州仓' },
      { name: '猫爬架大型猫树', category: 'supplies', price: 459, original_price: 599, description: '多层设计，稳固耐用', stock: 45, sales: 567, warehouse: '北京朝阳仓' },
      { name: '激光逗猫棒', category: 'toy', price: 29, original_price: 49, description: 'USB充电，多图案切换', stock: 567, sales: 8765, warehouse: '北京海淀仓' },
    ];
    for (const p of products) {
      await run(
        `INSERT INTO products (name, category, price, original_price, image, description, stock, sales, warehouse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.category, p.price, p.original_price, `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20product&image_size=square', p.description, p.stock, p.sales, p.warehouse]
      );
    }
    console.log('✅ 商品数据插入成功');

    await run(
      `INSERT INTO posts (user_id, content, images, likes, comments) VALUES (?, ?, ?, ?, ?)`,
      [1, '今天带豆豆去公园玩，遇到了好多小伙伴！夏天到了，大家都出来遛狗啦~ 🐕☀️', '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dogs%20playing%20in%20park%20summer&image_size=square"]', 128, 32]
    );
    await run(
      `INSERT INTO posts (user_id, content, images, likes, comments) VALUES (?, ?, ?, ?, ?)`,
      [1, '我家咪咪今天终于学会用猫抓板了！老母亲感动落泪 😭 买了好几个，终于有一个它喜欢的了', '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20using%20scratching%20post&image_size=square"]', 256, 48]
    );
    console.log('✅ 动态数据插入成功');

    const events = [
      { title: '周末宠物聚会', type: 'party', date: '2026-06-15 14:00', location: '朝阳公园宠物乐园', address: '北京市朝阳区朝阳公园南门', participants: 45, max_participants: 100, points_reward: 50, city: '北京' },
      { title: '狗狗运动会', type: 'competition', date: '2026-06-22 09:00', location: '奥体中心训练场', address: '北京市朝阳区奥体中心', participants: 78, max_participants: 200, points_reward: 100, city: '北京' },
      { title: '流浪动物领养日', type: 'adoption', date: '2026-06-20 10:00', location: '万达广场', address: '北京市朝阳区万达广场1号门', participants: 120, max_participants: 300, points_reward: 80, city: '北京' },
    ];
    for (const e of events) {
      await run(
        `INSERT INTO events (title, type, date, location, address, participants, max_participants, image, description, points_reward, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [e.title, e.type, e.date, e.location, e.address, e.participants, e.max_participants, `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20event&image_size=landscape_16_9`, '欢迎参加！', e.points_reward, e.city]
      );
    }
    console.log('✅ 活动数据插入成功');

    const insurancePlans = [
      { name: '萌宠意外险', type: 'accident', price: 99, coverage: 10000, duration: 365, description: '保障宠物意外受伤、中毒等情况', features: '["意外身故/伤残赔付10000元","意外医疗费用赔付5000元","第三方责任险2000元"]' },
      { name: '宠物医疗险', type: 'medical', price: 299, coverage: 30000, duration: 365, description: '覆盖常见疾病治疗费用', features: '["疾病住院医疗赔付30000元","门诊费用赔付5000元","手术费用全额赔付","全国多家医院直赔"]' },
      { name: '全能保障计划', type: 'medical', price: 599, coverage: 80000, duration: 365, description: '全方位保障，意外+疾病全覆盖', features: '["意外身故/伤残赔付50000元","疾病医疗赔付80000元","24小时在线兽医咨询","专属健康档案管理"]' },
    ];
    for (const plan of insurancePlans) {
      await run(
        `INSERT INTO insurance_plans (name, type, price, coverage, duration, description, features) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [plan.name, plan.type, plan.price, plan.coverage, plan.duration, plan.description, JSON.stringify(plan.features)]
      );
    }
    console.log('✅ 保险产品数据插入成功');

    await run(
      `INSERT INTO insurance_claims (user_id, pet_id, plan_id, plan_name, status, amount, description, images, review_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, 1, 2, '宠物医疗险', 'approved', 1280, '豆豆肠胃炎治疗费用', '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20bill%20invoice&image_size=square"]', '审核通过，理赔金额已到账']
    );
    await run(
      `INSERT INTO insurance_claims (user_id, pet_id, plan_id, plan_name, status, amount, description, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, 2, 1, '萌宠意外险', 'reviewing', 560, '咪咪爪子受伤治疗', '["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=veterinary%20receipt%20document&image_size=square"]']
    );
    console.log('✅ 理赔记录数据插入成功');

    const benefits = [
      { level: 'normal', name: '注册礼包', description: '新用户注册即送100积分', icon: 'Gift' },
      { level: 'silver', name: '9.5折优惠', description: '全场商品9.5折', icon: 'Percent' },
      { level: 'silver', name: '免费洗澡', description: '每年2次免费洗澡服务', icon: 'Bath' },
      { level: 'gold', name: '9折优惠', description: '全场商品9折', icon: 'Percent' },
      { level: 'gold', name: '优先预约', description: '服务预约优先安排', icon: 'Clock' },
      { level: 'gold', name: '免费体检', description: '每年1次免费体检', icon: 'Heart' },
      { level: 'diamond', name: '8.5折优惠', description: '全场商品8.5折', icon: 'Percent' },
      { level: 'diamond', name: '专属客服', description: '1对1专属客服服务', icon: 'Headphones' },
      { level: 'diamond', name: '生日礼包', description: '生日当月赠送大礼包', icon: 'Cake' },
    ];
    for (const b of benefits) {
      await run(
        `INSERT INTO member_benefits (level, name, description, icon) VALUES (?, ?, ?, ?)`,
        [b.level, b.name, b.description, b.icon]
      );
    }
    console.log('✅ 会员权益数据插入成功');

    console.log('\n🎉 数据库初始化完成！');
    console.log('📱 测试账号: 13800138000 / 123456');
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();
