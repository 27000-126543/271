import express from 'express';
import { run, get, all } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const pets = await all('SELECT * FROM pets WHERE user_id = ?', [req.user.id]);
    
    for (const pet of pets) {
      pet.vaccineRecords = await all('SELECT * FROM vaccine_records WHERE pet_id = ?', [pet.id]);
      pet.medicalHistory = await all('SELECT * FROM medical_records WHERE pet_id = ?', [pet.id]);
    }

    res.json({ pets });
  } catch (error) {
    res.status(500).json({ message: '获取宠物列表失败' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pet = await get('SELECT * FROM pets WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    
    if (!pet) {
      return res.status(404).json({ message: '宠物不存在' });
    }

    pet.vaccineRecords = await all('SELECT * FROM vaccine_records WHERE pet_id = ?', [pet.id]);
    pet.medicalHistory = await all('SELECT * FROM medical_records WHERE pet_id = ?', [pet.id]);

    res.json({ pet });
  } catch (error) {
    res.status(500).json({ message: '获取宠物详情失败' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, type, breed, age, gender, weight, personality, avatar } = req.body;

    if (!name || !type || !breed) {
      return res.status(400).json({ message: '请填写必填信息' });
    }

    const result = await run(
      `INSERT INTO pets (user_id, name, type, breed, age, gender, weight, personality, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, type, breed, age || 0, gender || 'male', weight || 0, personality || '', avatar || '']
    );

    const pet = await get('SELECT * FROM pets WHERE id = ?', [result.lastID]);
    pet.vaccineRecords = [];
    pet.medicalHistory = [];

    res.json({ message: '添加成功', pet });
  } catch (error) {
    res.status(500).json({ message: '添加失败' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, type, breed, age, gender, weight, personality, avatar } = req.body;

    const pet = await get('SELECT id FROM pets WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!pet) {
      return res.status(404).json({ message: '宠物不存在' });
    }

    await run(
      `UPDATE pets SET name = COALESCE(?, name), type = COALESCE(?, type), breed = COALESCE(?, breed), age = COALESCE(?, age), gender = COALESCE(?, gender), weight = COALESCE(?, weight), personality = COALESCE(?, personality), avatar = COALESCE(?, avatar) WHERE id = ?`,
      [name, type, breed, age, gender, weight, personality, avatar, req.params.id]
    );

    const updatedPet = await get('SELECT * FROM pets WHERE id = ?', [req.params.id]);
    updatedPet.vaccineRecords = await all('SELECT * FROM vaccine_records WHERE pet_id = ?', [req.params.id]);
    updatedPet.medicalHistory = await all('SELECT * FROM medical_records WHERE pet_id = ?', [req.params.id]);

    res.json({ message: '更新成功', pet: updatedPet });
  } catch (error) {
    res.status(500).json({ message: '更新失败' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pet = await get('SELECT id FROM pets WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!pet) {
      return res.status(404).json({ message: '宠物不存在' });
    }

    await run('DELETE FROM pets WHERE id = ?', [req.params.id]);
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除失败' });
  }
});

router.post('/:id/vaccine', async (req, res) => {
  try {
    const { name, date, nextDate, hospital } = req.body;
    
    await run(
      `INSERT INTO vaccine_records (pet_id, name, date, next_date, hospital) VALUES (?, ?, ?, ?, ?)`,
      [req.params.id, name, date, nextDate || null, hospital || '']
    );

    res.json({ message: '疫苗记录添加成功' });
  } catch (error) {
    res.status(500).json({ message: '添加失败' });
  }
});

router.post('/:id/medical', async (req, res) => {
  try {
    const { date, hospital, diagnosis, treatment, notes } = req.body;
    
    await run(
      `INSERT INTO medical_records (pet_id, date, hospital, diagnosis, treatment, notes) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.params.id, date, hospital || '', diagnosis, treatment || '', notes || '']
    );

    res.json({ message: '病史记录添加成功' });
  } catch (error) {
    res.status(500).json({ message: '添加失败' });
  }
});

export default router;
