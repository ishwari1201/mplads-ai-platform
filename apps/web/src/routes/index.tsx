import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '../pages/auth/Login';

// Role Pages
import { MpDashboard } from '../pages/mp/MpDashboard';
import { RecommendationForm } from '../pages/mp/RecommendationForm';
import { FundAllocationTracker } from '../pages/mp/FundAllocationTracker';
import { RecommendationList } from '../pages/mp/RecommendationList';

import { DaDashboard } from '../pages/da/DaDashboard';
import { ApprovalInbox } from '../pages/da/ApprovalInbox';
import { WorkDetailScrutiny } from '../pages/da/WorkDetailScrutiny';

import { IaDashboard } from '../pages/ia/IaDashboard';
import { IaWorkDetail } from '../pages/ia/IaWorkDetail';
import { ProgressUploader } from '../pages/ia/ProgressUploader';
import { PaymentRequestForm } from '../pages/ia/PaymentRequestForm';

import { StateDashboard } from '../pages/state/StateDashboard';
import { DistrictMonitoring } from '../pages/state/DistrictMonitoring';
import { StateRiskMonitoring } from '../pages/state/StateRiskMonitoring';
import { StateCaseManagement } from '../pages/state/StateCaseManagement';
import { StateContractorMonitoring } from '../pages/state/StateContractorMonitoring';
import { StateWorkDetail } from '../pages/state/StateWorkDetail';

import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { RiskMatrix } from '../pages/admin/RiskMatrix';

import { CitizenPortal } from '../pages/public/CitizenPortal';
import { TransparencyMap } from '../pages/public/TransparencyMap';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Main Shell Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 1. Member of Parliament Routes */}
        <Route path="/mp" element={<MpDashboard />} />
        <Route path="/mp/recommend" element={<RecommendationForm />} />
        <Route path="/mp/recommendations" element={<RecommendationList />} />
        <Route path="/mp/funds" element={<FundAllocationTracker />} />

        {/* 2. District Authority Routes */}
        <Route path="/da" element={<DaDashboard />} />
        <Route path="/da/recommendations" element={<ApprovalInbox />} />
        <Route path="/da/works" element={<DaDashboard />} />
        <Route path="/da/priority-cases" element={<DaDashboard />} />
        <Route path="/da/queue" element={<ApprovalInbox />} />
        <Route path="/da/evidence-requests" element={<ApprovalInbox />} />
        <Route path="/da/verification" element={<ApprovalInbox />} />
        <Route path="/da/inbox" element={<ApprovalInbox />} />
        <Route path="/da/scrutiny/:id" element={<WorkDetailScrutiny />} />
        <Route path="/da/map" element={<TransparencyMap />} />
        <Route path="/da/reports" element={<DaDashboard />} />

        {/* 3. State Authority Routes */}
        <Route path="/state" element={<StateDashboard />} />
        <Route path="/state/districts" element={<DistrictMonitoring />} />
        <Route path="/state/district/:id" element={<DistrictMonitoring />} />
        <Route path="/state/risk" element={<StateRiskMonitoring />} />
        <Route path="/state/cases" element={<StateCaseManagement />} />
        <Route path="/state/contractors" element={<StateContractorMonitoring />} />
        <Route path="/state/work/:id" element={<StateWorkDetail />} />

        {/* 3. Implementing Agency Routes */}
        <Route path="/ia" element={<IaDashboard />} />
        <Route path="/ia/work/:id" element={<IaWorkDetail />} />
        <Route path="/ia/upload" element={<ProgressUploader />} />
        <Route path="/ia/payment" element={<PaymentRequestForm />} />

        {/* 4. Admin Nodal Authority Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/explainability" element={<RiskMatrix />} />

        {/* 5. Citizen Oversight Routes */}
        <Route path="/public" element={<CitizenPortal />} />
        <Route path="/public/map" element={<TransparencyMap />} />
        <Route path="/public/report-fraud" element={<CitizenPortal />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
