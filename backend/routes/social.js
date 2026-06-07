import express from 'express';
import { run, get, all } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const posts = await all(
      `SELECT p.*, u.username, u.avatar as user_avatar 
       FROM posts p 
       LEFT JOIN users u ON p.user_id = u.id 
       ORDER BY p.created_at DESC`
    );
    
    for (const post of posts) {
      post.images = JSON.parse(post.images || '[]');
    }
    
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: '获取动态失败' });
  }
});

router.get('/events', async (req, res) => {
  try {
    const { city = 'all' } = req.query;
    let sql = 'SELECT * FROM events';
    const params = [];
    
    if (city !== 'all') {
      sql += ' WHERE city = ?';
      params.push(city);
    }
    sql += ' ORDER BY date DESC';
    
    const events = await all(sql, params);
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: '获取活动列表失败' });
  }
});

router.get('/events/:id', async (req, res) => {
  try {
    const event = await get('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!event) {
      return res.status(404).json({ message: '活动不存在' });
    }
    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: '获取活动详情失败' });
  }
});

router.use(authMiddleware);

router.post('/posts', async (req, res) => {
  try {
    const { content, images = [] } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: '请输入内容' });
    }

    await run(
      'INSERT INTO posts (user_id, content, images) VALUES (?, ?, ?)',
      [req.user.id, content, JSON.stringify(images)]
    );

    await run(
      'UPDATE users SET points = points + 5, activity_score = MIN(100, activity_score + 2) WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: '发布成功，获得5积分' });
  } catch (error) {
    res.status(500).json({ message: '发布失败' });
  }
});

router.post('/posts/:id/like', async (req, res) => {
  try {
    const existing = await get(
      'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing) {
      await run('DELETE FROM post_likes WHERE id = ?', [existing.id]);
      await run('UPDATE posts SET likes = likes - 1 WHERE id = ?', [req.params.id]);
      res.json({ message: '取消点赞', liked: false });
    } else {
      await run(
        'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
        [req.params.id, req.user.id]
      );
      await run('UPDATE posts SET likes = likes + 1 WHERE id = ?', [req.params.id]);
      res.json({ message: '点赞成功', liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: '操作失败' });
  }
});

router.get('/events/:id/join', async (req, res) => {
  try {
    const event = await get('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!event) {
      return res.status(404).json({ message: '活动不存在' });
    }

    const existing = await get(
      'SELECT id FROM event_participants WHERE event_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing) {
      return res.json({ message: '已报名', joined: true });
    }

    if (event.participants >= event.max_participants) {
      return res.status(400).json({ message: '活动名额已满' });
    }

    await run(
      'INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)',
      [req.params.id, req.user.id]
    );
    await run(
      'UPDATE events SET participants = participants + 1 WHERE id = ?',
      [req.params.id]
    );
    await run(
      'UPDATE users SET points = points + ?, activity_score = MIN(100, activity_score + 5) WHERE id = ?',
      [event.points_reward, req.user.id]
    );

    res.json({ message: `报名成功，获得${event.points_reward}积分`, joined: true });
  } catch (error) {
    res.status(500).json({ message: '报名失败' });
  }
});

router.post('/events/:id/checkin', async (req, res) => {
  try {
    const participant = await get(
      'SELECT * FROM event_participants WHERE event_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!participant) {
      return res.status(400).json({ message: '请先报名活动' });
    }
    if (participant.checked_in) {
      return res.json({ message: '已签到', checkedIn: true });
    }

    await run(
      'UPDATE event_participants SET checked_in = 1 WHERE id = ?',
      [participant.id]
    );
    await run(
      'UPDATE users SET points = points + 20, activity_score = MIN(100, activity_score + 3) WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: '签到成功，获得20积分', checkedIn: true });
  } catch (error) {
    res.status(500).json({ message: '签到失败' });
  }
});

export default router;
