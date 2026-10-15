'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || 'PW Medharthi';

const NAV_LINKS = [
  { href: '/career-fit-finder', label: 'Career-Fit Finder' },
  { href: '/career-roi-calculator', label: 'ROI Calculator' },
  { href: '/skill-gap-analyzer', label: 'Skill Gap Analyzer' },
  { href: '/career-roadmap-generator', label: 'Roadmap Generator' },
  { href: '/eligibility-checker', label: 'Eligibility Checker' }
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-navy-950 text-white shadow-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white p-1 shadow-sm">
            <Image src="/logo-icon.png" alt="PW Medharthi" width={28} height={28} className="h-full w-full object-contain" />
          </span>
          <span className="font-display text-[0.95rem] font-semibold tracking-tight sm:text-base">
            {BRAND} <span className="text-amber-500">Career Intelligence</span>
          </span>
        </Link>

        <nav className="hidden gap-7 text-sm font-medium text-white/75 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-amber-500">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="rounded-md p-2 text-white/80 hover:bg-white/10 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-navy-950 px-5 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium text-white/85 hover:bg-white/5 hover:text-amber-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
