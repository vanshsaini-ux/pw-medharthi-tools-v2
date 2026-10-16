import Image from 'next/image';
import {
  MessageCircle,
  Phone,
  Heart,
  ExternalLink,
} from 'lucide-react';

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || 'PW Medharthi';
const PRIVACY_URL = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || '#';

const CONTACT_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918130166658'
).replace(/[^0-9]/g, '');

const GITHUB_URL = 'https://github.com/kishorkumarbairagi69';

const TOOL_LINKS = [
  { href: '/career-fit-finder', label: 'Career-Fit Finder' },
  { href: '/career-roi-calculator', label: 'ROI Calculator' },
  { href: '/skill-gap-analyzer', label: 'Skill Gap Analyzer' },
  { href: '/career-roadmap-generator', label: 'Roadmap Generator' },
  { href: '/eligibility-checker', label: 'Eligibility Checker' },
];

/* Social platform logos (outline style, drawn as inline SVG because the
   icon library no longer ships brand logos). */
type IconProps = { size?: number };

function svgProps(size = 18) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };
}

function FacebookIcon({ size }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ size }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

/* To change a social link, edit the href below. To add a platform, copy
   one block and give it its own icon. */
const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com/PWMedharthi/',
    label: 'Facebook',
    Icon: FacebookIcon,
  },
  {
    href: 'https://www.instagram.com/pwmedharthi/',
    label: 'Instagram',
    Icon: InstagramIcon,
  },
  {
    href: 'https://www.linkedin.com/company/pw-medharthi/',
    label: 'LinkedIn',
    Icon: LinkedinIcon,
  },
];


export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-navy-950 text-white/70">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr]">
          {/* Brand */}
          <div>
            <a
              href="/"
              aria-label={`${BRAND} home`}
              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 shadow-sm"
            >
              <Image
                src="/logo-full.png"
                alt={BRAND}
                width={160}
                height={83}
                className="h-7 w-auto object-contain"
              />
            </a>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
              These tools provide data-informed guidance and are not a
              substitute for personalised counselling. For a detailed
              discussion of your specific situation, {BRAND}&rsquo;s program
              counsellors are available via chat, call, or WhatsApp.
            </p>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400"
                >
                  <Icon size={18} />
                </a>
              ))}

              <a
                href={`https://wa.me/${CONTACT_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400"
              >
                <MessageCircle size={18} />
              </a>

              <a
                href={`tel:+${CONTACT_NUMBER}`}
                aria-label="Call us"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Career tools */}
          <div>
            <p className="eyebrow text-amber-500/90">Career Tools</p>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {TOOL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition hover:text-amber-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {BRAND}. All rights reserved.
          </span>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={PRIVACY_URL}
              className="underline transition hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-white"
            >
              <ExternalLink size={13} />
              Developer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
