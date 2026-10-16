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

/* Official brand marks in their official brand colours.
   Facebook, Instagram and WhatsApp paths: Simple Icons (CC0 licence).
   LinkedIn path: Font Awesome Free 7 by Fonticons, Inc.
   (CC BY 4.0, https://fontawesome.com/license/free). */
type IconProps = { size?: number };

function FacebookIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a9 9 0 0 1 1.141.195v3.325a9 9 0 0 0-.653-.036 27 27 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.7 1.7 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="pw-instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEDA75" />
          <stop offset="25%" stopColor="#FA7E1E" />
          <stop offset="50%" stopColor="#D62976" />
          <stop offset="75%" stopColor="#962FBF" />
          <stop offset="100%" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <path fill="url(#pw-instagram-gradient)" d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388 5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552 1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388 5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912.056-1.28.07-1.69.063-4.948-.006-3.258-.02-3.667-.081-4.947-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123 5.86 5.86 0 0 0-2.128-1.38C19.074.322 18.202.12 16.924.066 15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895 3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228-.06-1.264-.072-1.644-.08-4.848-.006-3.204.006-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417 1.265-.06 1.644-.072 4.848-.08 3.203-.006 3.583.006 4.85.062 1.168.05 1.804.244 2.227.408.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227.06 1.265.074 1.645.08 4.848.005 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.23-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008" />
    </svg>
  );
}

function LinkedinIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 32 448 448" fill="#0A66C2" aria-hidden="true">
      <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3M135.4 416H69V202.2h66.5V416zM102.2 96a38.5 38.5 0 1 1 0 77 38.5 38.5 0 1 1 0-77m282.1 320h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9z" />
    </svg>
  );
}

function WhatsappIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52s.198-.298.298-.497c.099-.198.05-.371-.025-.52s-.669-1.612-.916-2.207c-.242-.579-.487-.5-.669-.51a13 13 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074s2.096 3.2 5.077 4.487c.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413s.248-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413" />
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
  {
    href: 'https://whatsapp.com/channel/0029Vb7KFVZ9mrGh9oR1zT3O',
    label: 'WhatsApp Channel',
    Icon: WhatsappIcon,
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
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Icon size={20} />
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
