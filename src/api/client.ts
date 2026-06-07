const API_BASE = 'http://localhost:3004/api';

interface RequestOptions extends RequestInit {
  body?: any;
  requiresAuth?: boolean;
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, requiresAuth = true, headers, ...rest } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers as Record<string, string>,
  };

  if (requiresAuth) {
    const token = localStorage.getItem('pet_token');
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...rest,
    headers: requestHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('pet_token');
        localStorage.removeItem('pet_user');
        window.location.href = '/login';
      }
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

export const api = {
  auth: {
    register: (data: { username: string; phone: string; password: string; city?: string }) =>
      request('/auth/register', { method: 'POST', body: data, requiresAuth: false }),
    login: (data: { phone: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: data, requiresAuth: false }),
    getProfile: () => request('/auth/profile'),
    updateProfile: (data: any) => request('/auth/profile', { method: 'PUT', body: data }),
  },

  pets: {
    getAll: () => request('/pets'),
    getById: (id: string) => request(`/pets/${id}`),
    create: (data: any) => request('/pets', { method: 'POST', body: data }),
    update: (id: string, data: any) => request(`/pets/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => request(`/pets/${id}`, { method: 'DELETE' }),
    addVaccine: (id: string, data: any) => request(`/pets/${id}/vaccine`, { method: 'POST', body: data }),
    addMedical: (id: string, data: any) => request(`/pets/${id}/medical`, { method: 'POST', body: data }),
  },

  services: {
    getProviders: (city = '北京') => request(`/services/providers?city=${city}`, { requiresAuth: false }),
    getProviderById: (id: string) => request(`/services/providers/${id}`, { requiresAuth: false }),
    getOrders: () => request('/services/orders'),
    getOrderById: (id: string) => request(`/services/orders/${id}`),
    createOrder: (data: any) => request('/services/orders', { method: 'POST', body: data }),
    cancelOrder: (id: string) => request(`/services/orders/${id}/cancel`, { method: 'POST' }),
    getVaccinePlans: () => request('/services/vaccine-plans'),
  },

  mall: {
    getProducts: (category = 'all', search = '') =>
      request(`/mall/products?category=${category}&search=${search}`, { requiresAuth: false }),
    getProductById: (id: string) => request(`/mall/products/${id}`, { requiresAuth: false }),
    getOrders: () => request('/mall/orders'),
    createOrder: (data: { items: any[]; address?: string }) =>
      request('/mall/orders', { method: 'POST', body: data }),
  },

  insurance: {
    getPlans: () => request('/insurance/plans', { requiresAuth: false }),
    getClaims: () => request('/insurance/claims'),
    getClaimById: (id: string) => request(`/insurance/claims/${id}`),
    createClaim: (data: any) => request('/insurance/claims', { method: 'POST', body: data }),
  },

  social: {
    getPosts: () => request('/social/posts', { requiresAuth: false }),
    createPost: (data: { content: string; images?: string[] }) =>
      request('/social/posts', { method: 'POST', body: data }),
    likePost: (id: string) => request(`/social/posts/${id}/like`, { method: 'POST' }),
    getEvents: (city = 'all') => request(`/social/events?city=${city}`, { requiresAuth: false }),
    getEventById: (id: string) => request(`/social/events/${id}`, { requiresAuth: false }),
    joinEvent: (id: string) => request(`/social/events/${id}/join`),
    checkInEvent: (id: string) => request(`/social/events/${id}/checkin`, { method: 'POST' }),
  },

  membership: {
    getBenefits: () => request('/membership/benefits', { requiresAuth: false }),
    getProgress: () => request('/membership/progress'),
  },

  admin: {
    getStats: (city = 'all', timeRange = '6m') =>
      request(`/admin/stats?city=${city}&timeRange=${timeRange}`),
    getReport: (month = '2026-06', city = 'all') =>
      request(`/admin/report?month=${month}&city=${city}`),
  },
};
