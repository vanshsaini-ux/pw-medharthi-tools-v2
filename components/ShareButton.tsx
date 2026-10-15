'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ShareButtonProps {
  title: string;
  text: string;
  toolSlug: string;
}

export default function ShareButton({ title, text, toolSlug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    trackEvent('tool_shared', { tool: toolSlug });
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user cancelled - fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-lg border border-navy-700/20 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-navy-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? 'Link copied' : 'Share my result'}
    </button>
  );
}
