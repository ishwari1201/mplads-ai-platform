import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mpService, MpDashboardStatsResponse } from '../../services/mpService';
import { WorkRecommendation } from '../../types/project';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LeafletMap } from '../../components/map/LeafletMap';
import { FundAllocationTracker } from './FundAllocationTracker';
import { PlusCircle, DollarSign, Clock, FileCheck, AlertTriangle, Layers } from 'lucide-react';

export const MpDashboard: React.FC = () => {
  const [stats, setStats] = useState<MpDashboardStatsResponse | null>(null);
  const [recommendations, setRecommendations] = useState<WorkRecommendation[]>([]);

  useEffect(() => {
    mpService.getDashboardStats().then(setStats).catch(console.error);
    mpService.getRecommendations().then((res) => setRecommendations(res.recommendations)).catch(console.error);
  }, []);

  const totalCr = stats ? (stats.financials.total_allocation / 10000000).toFixed(2) : '5.00';
  const spentCr = stats ? (stats.financials.total_spent / 10000000).toFixed(2) : '1.85';
  const pendingCount = stats ? stats.counts.pending_count : 2;
  const highRiskCount = stats ? stats.counts.high_risk_count : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Member of Parliament Operational Portal</h2>
          <p className="text-xs text-slate-400">
            Constituency: {stats?.constituency_name || 'Mumbai South'} ({stats?.party || 'Lok Sabha'})
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/mp/recommendations">
            <Button variant="secondary" size="md">
              <Layers size={16} className="mr-2" /> View All Recommended Works
            </Button>
          </Link>
          <Link to="/mp/recommend">
            <Button variant="primary" size="md">
              <PlusCircle size={16} className="mr-2" /> New Recommendation
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Executive Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card hoverEffect={false}>
          <CardContent className="flex items-center space-x-4">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Annual Entitlement</div>
              <div className="text-xl font-extrabold text-slate-100">₹{totalCr} Cr</div>
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect={false}>
          <CardContent className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <FileCheck size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Spent / Recommended</div>
              <div className="text-xl font-extrabold text-emerald-400">₹{spentCr} Cr</div>
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect={false}>
          <CardContent className="flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Unsanctioned Works</div>
              <div className="text-xl font-extrabold text-amber-400">{pendingCount} Pending</div>
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect={false}>
          <CardContent className="flex items-center space-x-4">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">High Risk Alerts</div>
              <div className="text-xl font-extrabold text-rose-400">{highRiskCount} Flagged</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Interactive Fund Allocation Tracker */}
      <FundAllocationTracker financials={stats?.financials} />

      {/* 3. GIS Map & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Constituency Work Locations (GIS PostGIS Plotting)</CardTitle>
          </CardHeader>
          <CardContent>
            <LeafletMap points={recommendations} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.slice(0, 4).map((rec: any) => (
              <div key={rec.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-xs text-slate-200">{rec.title}</div>
                  <Badge variant={rec.status === 'SANCTIONED' ? 'success' : 'warning'}>
                    {rec.status}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-400">{rec.address}</div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="font-bold text-sky-400">₹{Number(rec.estimated_cost).toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{rec.category || 'GENERAL'}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
