import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  FileText, PieChart, CheckSquare, Camera, AlertTriangle, 
  MapPin, ShieldCheck, HelpCircle, Layers, CreditCard, Building2, UserCheck,
  Briefcase
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'MP';

  const getRoleConfig = () => {
    const roleUpper = String(role).toUpperCase();

    if (roleUpper === 'MP' || roleUpper === 'MP_MLA') {
      return {
        title: 'Member of Parliament Menu',
        color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        items: [
          { name: 'MP Dashboard', path: '/mp', icon: PieChart },
          { name: 'New Recommendation', path: '/mp/recommend', icon: FileText },
          { name: 'Recommended Directory', path: '/mp/recommendations', icon: Layers },
          { name: 'Fund Allocation Tracker', path: '/mp/funds', icon: CreditCard },
        ],
      };
    } else if (roleUpper.includes('CENTRAL')) {
      return {
        title: 'Central Nodal Ministry Menu',
        color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        items: [
          { name: 'National Overview', path: '/central', icon: PieChart },
          { name: 'State / UT Monitoring', path: '/central/states', icon: Building2 },
          { name: 'All-India Risk Matrix', path: '/central/risk', icon: AlertTriangle },
          { name: 'Ministry Case Queue', path: '/central/cases', icon: CheckSquare },
          { name: 'National Funds', path: '/central/funds', icon: CreditCard },
          { name: 'Contractor Network', path: '/central/contractors', icon: Briefcase },
        ],
      };
    } else if (roleUpper.includes('STATE')) {
      return {
        title: 'State Authority Nodal Menu',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        items: [
          { name: 'State Overview', path: '/state', icon: PieChart },
          { name: 'District Monitoring', path: '/state/districts', icon: Building2 },
          { name: 'Risk & Anomaly Matrix', path: '/state/risk', icon: AlertTriangle },
          { name: 'Escalated Cases', path: '/state/cases', icon: CheckSquare },
          { name: 'Contractor Oversight', path: '/state/contractors', icon: Briefcase },
        ],
      };
    } else if (roleUpper.includes('DISTRICT') || roleUpper === 'DA') {
      return {
        title: 'District Collectorate Menu',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        items: [
          { name: 'Dashboard', path: '/da', icon: PieChart },
          { name: 'Recommendations', path: '/da/recommendations', icon: FileText },
          { name: 'Works', path: '/da/works', icon: Briefcase },
          { name: 'Case Queue', path: '/da/queue', icon: CheckSquare },
        ],
      };
    } else if (roleUpper.includes('IMPLEMENTING') || roleUpper === 'IA') {
      return {
        title: 'Implementing Agency Menu',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        items: [
          { name: 'IA Field Dashboard', path: '/ia', icon: Building2 },
          { name: 'Geotag Progress Upload', path: '/ia/upload', icon: Camera },
          { name: 'Milestone Payment Claims', path: '/ia/payment', icon: CreditCard },
        ],
      };
    } else if (roleUpper.includes('ADMIN') || roleUpper.includes('NODAL')) {
      return {
        title: 'Central Nodal Admin Menu',
        color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        items: [
          { name: 'Admin Anomaly Overview', path: '/admin', icon: ShieldCheck },
          { name: 'SHAP Risk Matrix Cards', path: '/admin/explainability', icon: AlertTriangle },
        ],
      };
    } else {
      return {
        title: 'Citizen Oversight Menu',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        items: [
          { name: 'Citizen Public Portal', path: '/public', icon: Layers },
          { name: 'GIS Transparency Map', path: '/public/map', icon: MapPin },
          { name: 'Report Fraud / Misuse', path: '/public/report-fraud', icon: AlertTriangle },
        ],
      };
    }
  };

  const config = getRoleConfig();

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 shrink-0 flex flex-col justify-between min-h-[calc(100vh-61px)]">
      <div className="p-4">
        <div className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider ${config.color} mb-3 flex items-center justify-between`}>
          <span>{config.title}</span>
        </div>

        <nav className="space-y-1">
          {config.items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-900">
        <div className="glass-card p-3 rounded-lg text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold mb-1">
            <HelpCircle size={16} className="text-sky-400" />
            <span>75-Day SLA Helpline</span>
          </div>
          <p className="text-[11px] text-slate-400">Statutory sanction deadline monitoring active for all district collectorates.</p>
        </div>
      </div>
    </aside>
  );
};
