import React from 'react';
import { PlayCircle } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export const TestRuns = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Autonomous Test Execution
        </h2>
        <p className="mt-1 text-sm text-white/45">
          Orchestrate headless Playwright test suites, capture video artifacts, and inspect traces.
        </p>
      </div>

      <EmptyState
        icon={PlayCircle}
        title="Test Runs Pipeline"
        description="Autonomous test execution with real-time video capture, step-by-step logs, and artifact storage is coming soon."
        badge="Segment 3"
      />
    </div>
  );
};

export default TestRuns;

