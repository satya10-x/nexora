import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, HelpCircle, Code } from 'lucide-react';
import Badge from '../common/Badge.jsx';

export const CriteriaScenarioCard = ({ scenario, index = 0, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showRaw, setShowRaw] = useState(false);

  if (!scenario) return null;

  const {
    title = `Scenario ${index + 1}`,
    given,
    givenAnd = [],
    when,
    whenAnd = [],
    then,
    thenAnd = [],
    raw,
    parsingStatus = 'parsed',
    confidence = 1.0,
  } = scenario;

  const confidencePercent = Math.round((confidence || 0) * 100);

  return (
    <div className="rounded-xl border border-white/[0.08] bg-ink-950/50 p-4 transition-all hover:border-white/[0.11]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-left text-sm font-semibold text-white hover:text-neon-cyan transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-white/45 shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-white/45 shrink-0" />
            )}
            <span>{title || `Scenario ${index + 1}`}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge type="parsingStatus" value={parsingStatus} size="xs" />
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/70 border border-white/[0.10]">
            {confidencePercent}% confidence
          </span>
          {raw && (
            <button
              type="button"
              onClick={() => setShowRaw(!showRaw)}
              className="text-[11px] text-white/45 hover:text-white/85 inline-flex items-center gap-1 underline underline-offset-2 ml-1"
            >
              <Code className="h-3 w-3" />
              <span>{showRaw ? 'Hide Raw' : 'Raw'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Raw Gherkin Text Display */}
      {showRaw && raw && (
        <div className="mt-3 rounded-lg bg-black/60 p-3 font-mono text-xs text-white/70 border border-white/[0.08] whitespace-pre-wrap">
          {raw}
        </div>
      )}

      {/* Structured Clauses View */}
      {expanded && (
        <div className="mt-3.5 space-y-2.5 text-xs">
          {/* Given Clause + GivenAnd */}
          {given ? (
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <span className="shrink-0 rounded bg-neon-cyan/10 border border-neon-cyan/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-neon-cyan uppercase tracking-wide">
                  Given
                </span>
                <span className="text-white/85 leading-relaxed font-mono">{given}</span>
              </div>
              {Array.isArray(givenAnd) && givenAnd.map((andClause, aIdx) => (
                <div key={aIdx} className="flex items-start gap-2 pl-6">
                  <span className="shrink-0 rounded bg-white/[0.06] border border-white/[0.10] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/45 uppercase tracking-wide">
                    And
                  </span>
                  <span className="text-white/70 leading-relaxed font-mono">{andClause}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-white/30 italic flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-amber-500/70" />
              <span>No Given precondition specified</span>
            </div>
          )}

          {/* When Clause + WhenAnd */}
          {when ? (
            <div className="space-y-1 pt-1">
              <div className="flex items-start gap-2">
                <span className="shrink-0 rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-300 uppercase tracking-wide">
                  When
                </span>
                <span className="text-white/85 leading-relaxed font-mono">{when}</span>
              </div>
              {Array.isArray(whenAnd) && whenAnd.map((andClause, aIdx) => (
                <div key={aIdx} className="flex items-start gap-2 pl-6">
                  <span className="shrink-0 rounded bg-white/[0.06] border border-white/[0.10] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/45 uppercase tracking-wide">
                    And
                  </span>
                  <span className="text-white/70 leading-relaxed font-mono">{andClause}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-white/30 italic flex items-center gap-1.5 pt-1">
              <AlertTriangle className="h-3 w-3 text-amber-500/70" />
              <span>No When action trigger specified</span>
            </div>
          )}

          {/* Then Clause + ThenAnd */}
          {then ? (
            <div className="space-y-1 pt-1">
              <div className="flex items-start gap-2">
                <span className="shrink-0 rounded bg-neon-violet/10 border border-neon-violet/25 px-1.5 py-0.5 font-mono text-[10px] font-bold text-neon-violet uppercase tracking-wide">
                  Then
                </span>
                <span className="text-white/85 leading-relaxed font-mono">{then}</span>
              </div>
              {Array.isArray(thenAnd) && thenAnd.map((andClause, aIdx) => (
                <div key={aIdx} className="flex items-start gap-2 pl-6">
                  <span className="shrink-0 rounded bg-white/[0.06] border border-white/[0.10] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/45 uppercase tracking-wide">
                    And
                  </span>
                  <span className="text-white/70 leading-relaxed font-mono">{andClause}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-white/30 italic flex items-center gap-1.5 pt-1">
              <AlertTriangle className="h-3 w-3 text-amber-500/70" />
              <span>No Then expected outcome specified</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CriteriaScenarioCard;

