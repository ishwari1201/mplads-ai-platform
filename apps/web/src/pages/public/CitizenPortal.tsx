import React, { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';
import { WorkRecommendation } from '../../types/project';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LeafletMap } from '../../components/map/LeafletMap';
import { ReportFraudModal } from './ReportFraudModal';
import { MapPin, Search, AlertTriangle, Eye } from 'lucide-react';

export const CitizenPortal: React.FC = () => {
  const [points, setPoints] = useState<WorkRecommendation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFraudModalOpen, setIsFraudModalOpen] = useState(false);

  useEffect(() => {
    publicService.getTransparencyMap().then((res) => setPoints(res.map_points)).catch(console.error);
  }, []);

  const filteredPoints = points.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.address || p.location_address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Citizen Transparency & Oversight Portal</h2>
          <p className="text-xs text-slate-400">Open Public Access to MPLADS Works, GIS Locations & Fund Disbursements</p>
        </div>
        <Button variant="gold" onClick={() => setIsFraudModalOpen(true)}>
          <AlertTriangle size={16} className="mr-2" /> Report Work Misuse / Ghost Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Public GIS Transparency Map</span>
            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search constituency works..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeafletMap points={filteredPoints} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publicly Funded MPLADS Works Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredPoints.map((item) => (
            <div key={item.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-sm text-slate-100">{item.title}</div>
                <div className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                  <MapPin size={14} className="text-sky-400" />
                  <span>{item.address || item.location_address || 'Mumbai City'}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Estimated Cost</div>
                  <div className="text-sm font-extrabold text-sky-400">₹{Number(item.estimated_cost).toLocaleString('en-IN')}</div>
                </div>
                <Badge variant={item.status === 'COMPLETED' ? 'success' : 'info'}>{item.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <ReportFraudModal
        isOpen={isFraudModalOpen}
        onClose={() => setIsFraudModalOpen(false)}
      />
    </div>
  );
};
