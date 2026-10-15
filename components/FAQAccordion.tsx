'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="card divide-y divide-navy-700/10">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-navy-900 transition hover:bg-navy-700/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              {item.question}
              <ChevronDown size={18} className={`shrink-0 text-navy-700/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <p className="px-5 pb-4 text-sm leading-relaxed text-navy-700/80">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
