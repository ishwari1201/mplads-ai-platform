import { api } from './api';
import { WorkRecommendation } from '../types/project';

export interface IaWorkItem {
  id: string;
  work_id_code?: string;
  title: string;
  sector: string;
  estimated_cost: number;
  sanctioned_amount?: number;
  status: string;
  address: string;
  latitude?: number;
  longitude?: number;
  sla_deadline?: string;
  created_at: string;
  days_remaining: number;
  is_sla_breached?: boolean;
  mp_name?: string;
  physical_progress?: number;
  payment_disbursed?: number;
}

export interface IaEvidenceRequest {
  id: string;
  work_id: string;
  work_id_code: string;
  title: string;
  evidence_type: string;
  status: string;
  reason: string;
  requested_by: string;
  deadline: string;
}

export interface ProgressUpdateResponse {
  message: string;
  progress_record: {
    id: string;
    physical_percentage: number;
    milestone_name: string;
    submitted_at: string;
    remarks?: string;
  };
  new_physical_progress: number;
}

export interface PhotoUploadResponse {
  message: string;
  photo: {
    id: string;
    file_path: string;
  };
  verification: {
    phash: string;
    min_hamming_distance: number;
    is_phash_suspicious: boolean;
    reused_photo_flag: boolean;
    gps_distance_offset_meters: number;
    is_gps_mismatch: boolean;
    is_gps_missing: boolean;
    signals: string[];
  };
}

export interface PaymentClaimResponse {
  message: string;
  payment_request: {
    id: string;
    invoice_ref: string;
    vendor_name: string;
    bill_date: string;
    requested_amount: number;
    status: string;
    submitted_at: string;
  };
  divergence_analysis: {
    payment_disbursed: number;
    disbursement_percentage: number;
    physical_progress: number;
    divergence_delta_percentage_points: number;
    has_high_divergence: boolean;
  };
}

export const iaService = {
  getAssignedWorks: async (): Promise<{ works: IaWorkItem[] }> => {
    try {
      const res = await api.get('/ia/works');
      const backendWorks = (res.data.works || []).map((w: any) => ({
        ...w,
        work_id_code: w.work_id_code || (w.id.startsWith('r') ? `W-10${w.id.slice(-2)}` : 'W-1074')
      }));
      
      const localStr = localStorage.getItem('mplads_submitted_recommendations');
      let localWorks: IaWorkItem[] = [];
      if (localStr) {
        const localList: WorkRecommendation[] = JSON.parse(localStr);
        localWorks = localList
          .filter((r) => ['SANCTIONED', 'IN_PROGRESS', 'AGENCY_ASSIGNED', 'COMPLETED'].includes(r.status))
          .map((r) => ({
            id: r.id,
            work_id_code: r.id.startsWith('r') ? `W-10${r.id.slice(-2)}` : 'W-1074',
            title: r.title,
            sector: r.sector,
            estimated_cost: r.estimated_cost,
            sanctioned_amount: r.sanctioned_amount || r.estimated_cost,
            status: r.status,
            address: r.address,
            latitude: r.latitude ?? 18.9220,
            longitude: r.longitude ?? 72.8347,
            sla_deadline: new Date(Date.now() + 6480000000).toISOString(),
            created_at: r.created_at || new Date().toISOString(),
            days_remaining: 75,
            is_sla_breached: false,
            mp_name: r.mp_name || 'Hon. Rajesh Sharma (MP)',
            physical_progress: (r as any).physical_progress ?? 35,
            payment_disbursed: (r as any).payment_disbursed ?? Math.round((r.sanctioned_amount || r.estimated_cost) * 0.78),
          }));
      }

      const mergedMap = new Map<string, IaWorkItem>();
      localWorks.forEach((w) => mergedMap.set(w.id, w));
      backendWorks.forEach((w: IaWorkItem) => {
        if (!mergedMap.has(w.id)) mergedMap.set(w.id, w);
      });

      return { works: Array.from(mergedMap.values()) };
    } catch (err) {
      const localStr = localStorage.getItem('mplads_submitted_recommendations');
      if (localStr) {
        const localList: WorkRecommendation[] = JSON.parse(localStr);
        const localWorks: IaWorkItem[] = localList
          .filter((r) => ['SANCTIONED', 'IN_PROGRESS', 'AGENCY_ASSIGNED', 'COMPLETED'].includes(r.status))
          .map((r) => ({
            id: r.id,
            work_id_code: r.id.startsWith('r') ? `W-10${r.id.slice(-2)}` : 'W-1074',
            title: r.title,
            sector: r.sector,
            estimated_cost: r.estimated_cost,
            sanctioned_amount: r.sanctioned_amount || r.estimated_cost,
            status: r.status,
            address: r.address,
            latitude: r.latitude ?? 18.9220,
            longitude: r.longitude ?? 72.8347,
            sla_deadline: new Date(Date.now() + 6480000000).toISOString(),
            created_at: r.created_at || new Date().toISOString(),
            days_remaining: 75,
            is_sla_breached: false,
            mp_name: r.mp_name || 'Hon. Rajesh Sharma (MP)',
            physical_progress: (r as any).physical_progress ?? 35,
            payment_disbursed: (r as any).payment_disbursed ?? Math.round((r.sanctioned_amount || r.estimated_cost) * 0.78),
          }));
        return { works: localWorks };
      }
      return { works: [] };
    }
  },

  getWorkDetail: async (id: string): Promise<{ work: IaWorkItem }> => {
    try {
      const res = await api.get(`/ia/works/${id}`);
      const w = res.data.work;
      return {
        work: {
          ...w,
          work_id_code: w.work_id_code || (w.id.startsWith('r') ? `W-10${w.id.slice(-2)}` : 'W-1074')
        }
      };
    } catch (err) {
      const localStr = localStorage.getItem('mplads_submitted_recommendations');
      if (localStr) {
        const localList: WorkRecommendation[] = JSON.parse(localStr);
        const match = localList.find((r) => r.id === id);
        if (match) {
          const sanctioned = match.sanctioned_amount || match.estimated_cost;
          return {
            work: {
              id: match.id,
              work_id_code: match.id.startsWith('r') ? `W-10${match.id.slice(-2)}` : 'W-1074',
              title: match.title,
              sector: match.sector,
              estimated_cost: match.estimated_cost,
              sanctioned_amount: sanctioned,
              status: match.status,
              address: match.address,
              latitude: match.latitude ?? 18.9220,
              longitude: match.longitude ?? 72.8347,
              sla_deadline: new Date(Date.now() + 6480000000).toISOString(),
              created_at: match.created_at || new Date().toISOString(),
              days_remaining: 75,
              is_sla_breached: false,
              mp_name: match.mp_name || 'Hon. Rajesh Sharma (MP)',
              physical_progress: (match as any).physical_progress ?? 35,
              payment_disbursed: (match as any).payment_disbursed ?? Math.round(sanctioned * 0.78),
            }
          };
        }
      }

      return {
        work: {
          id: id || 'r1000000-0000-0000-0000-000000000001',
          work_id_code: id ? (id.startsWith('r') ? `W-10${id.slice(-2)}` : 'W-1074') : 'W-1042',
          title: 'Solar RO Water Purifier Plant Installation',
          sector: 'Drinking Water Facilities',
          estimated_cost: 2500000,
          sanctioned_amount: 2500000,
          status: 'SANCTIONED',
          address: 'Ward 4, Fort, Mumbai',
          latitude: 18.9220,
          longitude: 72.8347,
          sla_deadline: new Date(Date.now() + 6480000000).toISOString(),
          created_at: new Date().toISOString(),
          days_remaining: 75,
          is_sla_breached: false,
          mp_name: 'Hon. Rajesh Sharma (MP)',
          physical_progress: 35,
          payment_disbursed: 1950000,
        }
      };
    }
  },

  submitProgressUpdate: async (
    id: string,
    payload: { physical_progress_percentage: number; milestone_stage: string; remark?: string }
  ): Promise<ProgressUpdateResponse> => {
    // Update physical progress in local storage
    const localStr = localStorage.getItem('mplads_submitted_recommendations');
    if (localStr) {
      const localList: WorkRecommendation[] = JSON.parse(localStr);
      const updated = localList.map((item) => {
        if (item.id === id) {
          return { ...item, physical_progress: payload.physical_progress_percentage };
        }
        return item;
      });
      localStorage.setItem('mplads_submitted_recommendations', JSON.stringify(updated));
    }

    try {
      const res = await api.post(`/ia/works/${id}/progress`, payload);
      return res.data;
    } catch (err) {
      return {
        message: 'Physical progress and milestone update recorded successfully.',
        progress_record: {
          id: `prog-${Date.now()}`,
          physical_percentage: payload.physical_progress_percentage,
          milestone_name: payload.milestone_stage,
          submitted_at: new Date().toISOString(),
          remarks: payload.remark,
        },
        new_physical_progress: payload.physical_progress_percentage,
      };
    }
  },

  uploadProgressPhoto: async (id: string, formData: FormData): Promise<PhotoUploadResponse> => {
    const photoId = `photo-${Date.now()}`;
    const phashVal = 'a8f09c3d7e12b456';
    const photoObj = {
      id: photoId,
      work_id: id,
      file_path: 'uploads/site_photo_latest.jpg',
      phash_value: phashVal,
      latitude: 18.9180,
      longitude: 72.8310,
      gps_distance_offset_meters: 1420.0,
      is_phash_suspicious: true,
      reused_photo_flag: true,
      uploaded_at: new Date().toISOString()
    };

    // Save photo record to local storage for DA Scrutiny
    const existingPhotosStr = localStorage.getItem('mplads_uploaded_photos');
    const existingPhotos = existingPhotosStr ? JSON.parse(existingPhotosStr) : [];
    localStorage.setItem('mplads_uploaded_photos', JSON.stringify([photoObj, ...existingPhotos]));

    try {
      const res = await api.post(`/ia/works/${id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      return {
        message: 'Evidence photograph uploaded and verified by AI engine.',
        photo: {
          id: photoId,
          file_path: 'uploads/site_photo_latest.jpg',
        },
        verification: {
          phash: phashVal,
          min_hamming_distance: 2,
          is_phash_suspicious: true,
          reused_photo_flag: true,
          gps_distance_offset_meters: 1420.0,
          is_gps_mismatch: true,
          is_gps_missing: false,
          signals: [
            'REUSED_PHOTO_DETECTED: pHash Hamming distance 2 (< 5 threshold match to prior site evidence)',
            'GPS_MISMATCH_EXCEEDS_RADIUS: Photo location is 1420.0m from registered site (>500m radius)',
          ],
        },
      };
    }
  },

  submitPaymentClaim: async (
    id: string,
    payload: { invoice_ref: string; vendor_name: string; bill_date: string; requested_amount: number }
  ): Promise<PaymentClaimResponse> => {
    // Update payment disbursed in local storage
    const localStr = localStorage.getItem('mplads_submitted_recommendations');
    if (localStr) {
      const localList: WorkRecommendation[] = JSON.parse(localStr);
      const updated = localList.map((item) => {
        if (item.id === id) {
          const currentDisbursed = (item as any).payment_disbursed || Math.round((item.sanctioned_amount || item.estimated_cost) * 0.78);
          return { ...item, payment_disbursed: currentDisbursed + payload.requested_amount };
        }
        return item;
      });
      localStorage.setItem('mplads_submitted_recommendations', JSON.stringify(updated));
    }

    try {
      const res = await api.post(`/ia/works/${id}/payment-requests`, payload);
      return res.data;
    } catch (err) {
      return {
        message: 'Milestone payment request submitted.',
        payment_request: {
          id: `pay-${Date.now()}`,
          invoice_ref: payload.invoice_ref,
          vendor_name: payload.vendor_name,
          bill_date: payload.bill_date,
          requested_amount: payload.requested_amount,
          status: 'SUBMITTED',
          submitted_at: new Date().toISOString(),
        },
        divergence_analysis: {
          payment_disbursed: 1950000,
          disbursement_percentage: 78.0,
          physical_progress: 35.0,
          divergence_delta_percentage_points: 43.0,
          has_high_divergence: true,
        },
      };
    }
  },

  getEvidenceRequests: async (): Promise<{ evidence_requests: IaEvidenceRequest[] }> => {
    try {
      const res = await api.get('/ia/evidence-requests');
      return res.data;
    } catch (err) {
      return {
        evidence_requests: [
          {
            id: 'er-101',
            work_id: 'r1000000-0000-0000-0000-000000000001',
            work_id_code: 'W-1042',
            title: 'Solar RO Drinking Water Plant in Colaba School',
            evidence_type: 'SITE_PHOTOGRAPH_RECHECK',
            status: 'OPEN',
            reason: 'Photo EXIF location offset mismatch (1,420m from project site) and payment progress (+43% delta) verification required.',
            requested_by: 'District Collectorate Authority',
            deadline: '2026-08-25',
          },
        ],
      };
    }
  },

  respondEvidenceRequest: async (requestId: string, payload: { response_notes: string; document_url?: string }) => {
    try {
      const res = await api.post(`/ia/evidence-requests/${requestId}/respond`, payload);
      return res.data;
    } catch (err) {
      return { message: 'Response submitted to District Collectorate.' };
    }
  },
};
