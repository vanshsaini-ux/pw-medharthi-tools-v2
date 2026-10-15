'use client';

import { useEffect, useState } from 'react';
import { Check, Lock, ExternalLink } from 'lucide-react';
import { RoadmapResult } from '@/tools/roadmapGenerator';
import { EXPLORE_PROGRAMS_URL } from '@/lib/links';

interface RoadmapPathProps {
  roadmap: RoadmapResult;
  showAll: boolean;
  onUnlock: () => void;
}

/** A roadmap.sh-inspired vertical path: numbered milestone nodes connected
 * by a spine, each expanding into checkable topic chips so a learner can
 * actually track progress through the plan rather than just read it once. */
export default function RoadmapPath({ roadmap, showAll, onUnlock }: RoadmapPathProps) {
  const storageKey = `pw-roadmap-progress:${roadmap.targetRole.toLowerCase().trim()}:${roadmap.timelineMonths}`;
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // localStorage unavailable (private browsing etc.) - progress just won't persist.
    }
    setLoaded(true);
  }, [storageKey]);

  function toggle(key: string) {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  const visibleMilestones = showAll ? roadmap.milestones : roadmap.milestones.slice(0, 1);
  const totalActivities = roadmap.milestones.reduce((sum, m) => sum + m.activities.length, 0);
  const doneCount = loaded ? Object.values(done).filter(Boolean).length : 0;
  const progressPct = totalActivities > 0 ? Math.round((doneCount / totalActivities) * 100) : 0;

  return (
    <div>
      {showAll && (
        <div className="mb-7 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-700/10">
            <div className="h-full rounded-full bg-teal-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="whitespace-nowrap font-mono text-xs font-medium text-navy-700/60">
            {doneCount}/{totalActivities} done
          </span>
        </div>
      )}

      <div className="relative">
        <div className="absolute bottom-2 left-[15px] top-2 w-px bg-navy-700/15 sm:left-[19px]" aria-hidden="true" />

        <div className="space-y-9">
          {visibleMilestones.map((m, idx) => (
            <div key={m.monthRangeLabel} className="relative pl-10 sm:pl-12">
              <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 font-mono text-xs font-semibold text-amber-500 ring-4 ring-paper sm:h-10 sm:w-10 sm:text-sm">
                {idx + 1}
              </div>

              <p className="eyebrow">{m.monthRangeLabel}</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-navy-900">{m.focus}</h3>

              <div className="mt-3.5 flex flex-wrap gap-2">
                {m.activities.map((activity, ai) => {
                  const key = `${idx}-${ai}`;
                  const isDone = !!done[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggle(key)}
                      aria-pressed={isDone}
                      className={`flex max-w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isDone
                          ? 'border-teal-500/40 bg-teal-100/50 text-navy-700/50 line-through'
                          : 'border-navy-700/15 bg-white text-navy-800 hover:border-amber-500/50 hover:bg-amber-100/15'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
                          isDone ? 'border-teal-500 bg-teal-500 text-white' : 'border-navy-700/30'
                        }`}
                      >
                        {isDone && <Check size={10} strokeWidth={3} />}
                      </span>
                      <span>{activity}</span>
                    </button>
                  );
                })}
              </div>

              {m.matchedProgramName && (
                <a
                  href={EXPLORE_PROGRAMS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-100/40 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                >
                  Covered in: {m.matchedProgramName}
                  <ExternalLink size={12} className="shrink-0" />
                </a>
              )}
            </div>
          ))}

          {!showAll && roadmap.milestones.length > 1 && (
            <div className="relative pl-10 sm:pl-12">
              <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-navy-700/10 text-navy-700/40 sm:h-10 sm:w-10">
                <Lock size={14} />
              </div>
              <p className="font-medium text-navy-900">{roadmap.milestones.length - 1} more milestones, locked</p>
              <p className="mt-1 text-sm leading-relaxed text-navy-700/70">
                Unlock your full roadmap as a downloadable, shareable, trackable plan.
              </p>
              <button onClick={onUnlock} className="btn-primary mt-3">
                Unlock My Full Roadmap
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
