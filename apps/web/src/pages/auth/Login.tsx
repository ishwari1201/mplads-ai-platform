import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { UserRole } from '../../types/user';
import { Button } from '../../components/ui/Button';

export const Login: React.FC = () => {
  const { loginAsRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleLogin = (role: UserRole) => {
    loginAsRole(role);
    switch (role) {
      case 'MP': navigate('/mp'); break;
      case 'DISTRICT_AUTHORITY': navigate('/da'); break;
      case 'STATE_AUTHORITY': navigate('/state'); break;
      case 'CENTRAL_AUTHORITY': navigate('/central'); break;
      case 'IMPLEMENTING_AGENCY': navigate('/ia'); break;
      case 'ADMIN': navigate('/admin'); break;
      case 'CITIZEN': navigate('/public'); break;
    }
  };

  const roles: Array<{ role: UserRole; title: string; desc: string }> = [
    { role: 'MP', title: '1. Member of Parliament', desc: 'Submit recommendations & track ₹5 Cr allocation.' },
    { role: 'DISTRICT_AUTHORITY', title: '2. District Authority', desc: 'Scrutinize proposals & issue administrative sanctions.' },
    { role: 'STATE_AUTHORITY', title: '3. State Nodal Authority', desc: 'Monitor district execution, high-risk works & escalations.' },
    { role: 'CENTRAL_AUTHORITY', title: '4. Central Nodal Ministry (MoSPI)', desc: 'National programme oversight, cross-state anomalies & fund releases.' },
    { role: 'IMPLEMENTING_AGENCY', title: '5. Implementing Agency', desc: 'Upload EXIF progress photos & milestone billing.' },
    { role: 'ADMIN', title: '6. Nodal Authority Admin', desc: 'Inspect national risk matrix & SHAP AI explainability.' },
    { role: 'CITIZEN', title: '7. Citizen Oversight Portal', desc: 'Public transparency map & geotagged fraud reporting.' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl shadow-2xl border border-slate-800">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">e-MPLADS Platform</h2>
          <p className="text-xs text-slate-400 mt-1">Government of India Integrated Works & AI Fraud Prevention</p>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Portal Persona to Login</div>
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => handleRoleLogin(r.role)}
              className="w-full text-left glass-card p-4 rounded-xl hover:bg-sky-500/10 hover:border-sky-500/40 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-sm font-bold text-slate-200 group-hover:text-sky-400">{r.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{r.desc}</div>
              </div>
              <ArrowRight size={16} className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
