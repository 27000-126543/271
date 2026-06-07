import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'data.json');

let data = {
  users: [],
  pets: [],
  vaccine_records: [],
  medical_records: [],
  service_providers: [],
  service_items: [],
  service_orders: [],
  daily_updates: [],
  products: [],
  orders: [],
  order_items: [],
  posts: [],
  post_likes: [],
  events: [],
  event_participants: [],
  insurance_plans: [],
  insurance_claims: [],
  member_benefits: [],
  counters: {}
};

function loadDB() {
  try {
    if (fs.existsSync(dbPath)) {
      const fileData = fs.readFileSync(dbPath, 'utf8');
      data = JSON.parse(fileData);
      console.log('✅ 数据库加载成功');
    }
  } catch (error) {
    console.error('加载数据库失败:', error.message);
  }
}

function saveDB() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('保存数据库失败:', error.message);
  }
}

function nextId(table) {
  if (!data.counters[table]) {
    data.counters[table] = data[table]?.length > 0 
      ? Math.max(...data[table].map(item => item.id)) + 1 
      : 1;
  } else {
    data.counters[table]++;
  }
  return data.counters[table];
}

loadDB();

export const run = (sql, params = []) => {
  const tableMatch = sql.match(/FROM\s+(\w+)|INTO\s+(\w+)|UPDATE\s+(\w+)/i);
  const table = tableMatch?.[1] || tableMatch?.[2] || tableMatch?.[3];
  
  if (sql.trim().toUpperCase().startsWith('INSERT')) {
    const newItem = { id: nextId(table) };
    const columns = sql.match(/\(([^)]+)\)/)[1].split(',').map(s => s.trim());
    columns.forEach((col, i) => {
      if (params[i] !== undefined) {
        newItem[col] = params[i];
      }
    });
    newItem.created_at = new Date().toISOString();
    data[table].push(newItem);
    saveDB();
    return { lastID: newItem.id, changes: 1 };
  }
  
  if (sql.trim().toUpperCase().startsWith('UPDATE')) {
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s*$|;)/i);
    let updated = 0;
    
    data[table].forEach(item => {
      let match = true;
      if (whereMatch) {
        const conditions = whereMatch[1].split('AND').map(s => s.trim());
        conditions.forEach(cond => {
          const [field, op, val] = cond.split(/\s+/);
          if (op === '=' && item[field] !== parseInt(val) && item[field] !== val) {
            match = false;
          }
        });
      }
      if (match) {
        const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
        if (setMatch) {
          const sets = setMatch[1].split(',').map(s => s.trim());
          sets.forEach(s => {
            const [field, val] = s.split('=').map(x => x.trim());
            if (val === 'CURRENT_TIMESTAMP') {
              item[field] = new Date().toISOString();
            } else if (val.startsWith('?')) {
              const idx = parseInt(val.replace('?', '')) || params.findIndex(p => p === val);
              item[field] = params[idx];
            } else if (val.includes('+') || val.includes('-')) {
              const parts = val.split(/\s*([+-])\s*/);
              let val1 = parseInt(item[parts[0]]) || item[parts[0]] || 0;
              const op = parts[1];
              const val2 = parseInt(parts[2]) || 0;
              item[field] = op === '+' ? val1 + val2 : val1 - val2;
            } else {
              item[field] = val;
            }
          });
        }
        updated++;
      }
    });
    saveDB();
    return { changes: updated };
  }
  
  if (sql.trim().toUpperCase().startsWith('DELETE')) {
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s*$|;)/i);
    const beforeLength = data[table].length;
    
    data[table] = data[table].filter(item => {
      if (!whereMatch) return false;
      let match = true;
      const conditions = whereMatch[1].split('AND').map(s => s.trim());
      conditions.forEach(cond => {
        const [field, op, val] = cond.split(/\s+/);
        if (op === '=' && item[field] !== parseInt(val) && item[field] !== val) {
          match = false;
        }
      });
      return !match;
    });
    
    saveDB();
    return { changes: beforeLength - data[table].length };
  }
  
  return { changes: 0 };
};

export const get = (sql, params = []) => {
  const result = all(sql, params);
  return result[0] || undefined;
};

export const all = (sql, params = []) => {
  const tableMatch = sql.match(/FROM\s+(\w+)/i);
  const table = tableMatch?.[1];
  if (!table || !data[table]) return [];
  
  let result = [...data[table]];
  
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|GROUP|LIMIT|$)/i);
  if (whereMatch) {
    const whereStr = whereMatch[1];
    result = result.filter(item => {
      if (whereStr.includes('?')) {
        const parts = whereStr.split('AND').map(s => s.trim());
        return parts.every((part, i) => {
          if (part.includes('?')) {
            const [field] = part.split('=');
            const val = params[i];
            if (val === 'all') return true;
            return item[field.trim()] === val || item[field.trim()] === parseInt(val);
          }
          return true;
        });
      }
      return true;
    });
  }
  
  const orderMatch = sql.match(/ORDER\s+BY\s+(.+?)(?:\s|LIMIT|$)/i);
  if (orderMatch) {
    const [field, direction] = orderMatch[1].split(/\s+/);
    result.sort((a, b) => {
      if (direction?.toUpperCase() === 'DESC') {
        return a[field] > b[field] ? -1 : 1;
      }
      return a[field] > b[field] ? 1 : -1;
    });
  }
  
  return result;
};

export { data, saveDB };
