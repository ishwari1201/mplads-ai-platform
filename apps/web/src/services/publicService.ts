import { api } from './api';
import { WorkRecommendation } from '../types/project';

export const publicService = {
  getTransparencyMap: async (): Promise<{ map_points: WorkRecommendation[] }> => {
    const res = await api.get('/public/transparency-map');
    return res.data;
  },
  reportFraud: async (formData: FormData) => {
    const res = await api.post('/public/report-fraud', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};
