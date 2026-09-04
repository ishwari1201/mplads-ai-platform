import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mpService } from '../../services/mpService';
import { WorkRecommendation } from '../../types/project';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PlusCircle, MapPin, Clock, AlertTriangle, Search } from 'lucide-react';

export const RecommendationList: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<WorkRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    mpService
      .getRecommendations()
      .then((res) => setRecommendations(res.recommendations))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SANCTIONED': return <Badge variant="success">SANCTIONED</Badge>;
      case 'IN_PROGRESS': return <Badge variant="info">IN PROGRESS</Badge>;
      case 'COMPLETED': return <Badge variant="purple">COMPLETED</Badge>;
      case 'REJECTED': return <Badge variant="danger">REJECTED</Badge>;
      case 'FROZEN_PENDING_AUDIT': return <Badge variant="danger">FROZEN (AUDIT FLAG)</Badge>;
      case 'RECOMMENDED':
      default:
        return <Badge variant="warning">RECOMMENDED</Badge>;
    }
  };

  const filtered = recommendations.filter((r) =>
    r.title.toLowerCase().includes(filterText.toLowerCase()) ||
    r.sector.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Recommended Works Directory</h2>
          <p className="text-xs text-slate-400">Track Sanction Lifecycle, SLA Deadlines & Financials</p>
        </div>
        <Link to="/mp/recommend">
          <Button variant="primary" size="md">
            <PlusCircle size={16} className="mr-2" /> New Recommendation
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Submitted Projects ({filtered.length})</span>
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Filter works..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading recommendations...</div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No project recommendations found.</div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item: any) => {
                const daysRem = item.days_remaining !== undefined ? Math.max(0, Math.round(item.days_remaining)) : 65;
                const isBreached = item.is_sla_breached || false;

                return (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-sky-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-100">{item.title}</span>
                        {getStatusBadge(item.status)}
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {item.category || 'GENERAL'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center space-x-1">
                          <MapPin size={13} className="text-sky-400" />
                          <span>{item.address}</span>
                        </span>
                        <span>Sector: {item.sector}</span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between items-end shrink-0 border-t md:border-t-0 border-slate-900 pt-3 md:pt-0">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Estimated Budget</div>
                        <div className="text-base font-extrabold text-sky-400">
                          ₹{Number(item.estimated_cost).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-xs mt-2">
                        <Clock size={13} className={isBreached ? 'text-rose-400' : 'text-amber-400'} />
                        <span className={isBreached ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {isBreached ? 'SLA Breached' : `SLA: ${daysRem} Days Left`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
