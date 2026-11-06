import React from 'react';
import { BarChart3 } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Test Reports & Quality Analytics
        </h2>
        <p className="mt-1 text-sm text-white/45">
          Historical execution trends, flakiness indices, and locator healing analytics.
        </p>
      </div>

      <EmptyState
        icon={BarChart3}
        title="Quality Reports & Insights"
        description="Comprehensive E2E test runs telemetry, duration trends, video replay player, and locator repair logs will be visualised here."
        badge="Analytics Module"
      />
    </div>
  );
};

export default Reports;

