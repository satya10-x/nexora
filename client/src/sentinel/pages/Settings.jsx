import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          System Configuration
        </h2>
        <p className="mt-1 text-sm text-white/45">
          Configure model parameters, Jira webhooks, artifact retention policies, and worker concurrency.
        </p>
      </div>

      <EmptyState
        icon={SettingsIcon}
        title="Settings & Integrations"
        description="Granular settings for LLM prompts, Jira synchronization frequencies, and Playwright execution workers will be configurable here."
        badge="Segment 5"
      />
    </div>
  );
};

export default Settings;

