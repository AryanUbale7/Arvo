import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { mockDb } from '@/utils/mockDb';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = useAuthStore.getState();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleMockRequest = async (config: any): Promise<AxiosResponse> => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const data = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : null;

  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));

  let responseData: any = null;
  let status = 200;

  if (url.startsWith('/auth/me')) {
    responseData = { data: { id: '1', name: 'Aryan', email: 'aryan@arvo.ai' } };
  } else if (url.startsWith('/auth/login')) {
    responseData = {
      user_id: 1,
      email: data?.email || 'aryan@arvo.ai',
      name: 'Aryan',
      access_token: 'mock-jwt-token-xyz',
      refresh_token: 'mock-refresh-token-xyz'
    };
  } else if (url.startsWith('/projects/ai-create')) {
    // Spawn new AI project workspace
    const newProj = mockDb.createProjectFromPrompt(data.prompt);
    responseData = newProj;
  } else if (url.startsWith('/projects/')) {
    const projIdMatch = url.match(/\/projects\/([a-zA-Z0-9_]+)/);
    const projectId = projIdMatch ? projIdMatch[1] : null;

    if (projectId) {
      if (method === 'get') {
        responseData = mockDb.getProject(projectId);
      } else if (method === 'post' && url.endsWith('/message')) {
        // Post follow-up prompt
        const proj = mockDb.addMessageToProject(projectId, 'user', data.message);
        
        // Simulate AI answering steps
        await new Promise(resolve => setTimeout(resolve, 800));
        const aiMessage = `Perfect! I am updating the generated workspace. Refined tailwind configurations and added interactive state bindings for: **"${data.message}"**`;
        const updatedProj = mockDb.addMessageToProject(projectId, 'assistant', aiMessage, [
          'arvo: scanning prompt modifications...',
          'arvo: rebuilding React component states',
          'arvo: hot module reloading (HMR) complete'
        ]);

        responseData = updatedProj;
      }
    }
  }

  if (!responseData) {
    responseData = { message: 'Mock response success', data: {} };
  }

  return {
    data: responseData,
    status,
    statusText: 'OK',
    headers: {},
    config: config,
  } as AxiosResponse;
};

// Response Interceptor with network fallback
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    // For local demo, always route requests directly into the mock interceptor, 
    // eliminating backend dependency while keeping exact REST API interfaces!
    try {
      return await handleMockRequest(originalRequest);
    } catch (mockError) {
      return Promise.reject(mockError);
    }
  }
);
