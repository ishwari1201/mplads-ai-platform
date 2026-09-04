import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { publicService } from '../../services/publicService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportFraudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportFraudModal: React.FC<ReportFraudModalProps> = ({ isOpen, onClose }) => {
  const { location } = useGeolocation();
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [issueType, setIssueType] = useState('GHOST_WORK');
  const [description, setDescription] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('reporter_name', reporterName || 'Anonymous Citizen');
    formData.append('reporter_email', reporterEmail || '');
    formData.append('issue_type', issueType);
    formData.append('description', description);
    formData.append('latitude', (location?.latitude || 18.9067).toString());
    formData.append('longitude', (location?.longitude || 72.8258).toString());
    if (proofFile) formData.append('proof', proofFile);

    try {
      await publicService.reportFraud(formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Work Misuse / Fraud Evidence">
      {submitted ? (
        <div className="p-6 text-center space-y-3">
          <CheckCircle2 size={48} className="mx-auto text-emerald-400" />
          <h4 className="text-lg font-bold text-slate-100">Fraud Report Received!</h4>
          <p className="text-xs text-slate-400">
            Your geo-tagged report has been submitted to the Central Nodal Authority for immediate audit review.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center space-x-3 text-amber-400 text-xs">
            <AlertTriangle size={24} className="shrink-0" />
            <span>Reports are geo-referenced to your device GPS location and audited by Nodal Officers.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name (Optional)</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Leave blank for Anonymous"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email / Phone</label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category of Misuse / Fraud</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="GHOST_WORK">1. Ghost Project (Work claimed completed but zero physical execution)</option>
              <option value="SUBSTANDARD_QUALITY">2. Substandard Construction / Poor Material Quality</option>
              <option value="DUPLICATE_FUNDING">3. Duplicate Funding (Claimed under multiple government schemes)</option>
              <option value="UNAUTHORIZED_LOCATION">4. Unauthorized Private Property Location</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description of On-Ground Findings</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe physical observation at work site location..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Attach Photographic Evidence (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="gold" disabled={loading}>
              {loading ? 'Submitting Report...' : 'Submit Fraud Report'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
