type Kind =
  | 'sunshine'
  | 'first-smile'
  | 'tiny-hands'
  | 'garden'
  | 'first-steps'
  | 'starry'
  | 'birthday'
  | 'snow'

export function Illustration({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'sunshine':
      return (
        <svg viewBox="0 0 320 200" className="illu" aria-hidden>
          <defs>
            <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8DFF5" />
              <stop offset="100%" stopColor="#F7EFE6" />
            </linearGradient>
            <radialGradient id="sun1" cx="70%" cy="28%" r="40%">
              <stop offset="0%" stopColor="#FFE6A8" />
              <stop offset="100%" stopColor="#FFE6A800" />
            </radialGradient>
          </defs>
          <rect width="320" height="200" rx="12" fill="url(#sky1)" />
          <circle cx="230" cy="48" r="56" fill="url(#sun1)" />
          <ellipse cx="160" cy="168" rx="110" ry="22" fill="#D9C8B0" opacity=".45" />
          <ellipse cx="160" cy="155" rx="78" ry="14" fill="#E8D5C0" />
          <ellipse cx="148" cy="128" rx="42" ry="28" fill="#F3D4C8" />
          <circle cx="148" cy="98" r="22" fill="#F6D9CE" />
          <ellipse cx="148" cy="112" rx="16" ry="8" fill="#E8B8A8" opacity=".35" />
          <path d="M118 150c8-18 52-18 60 0" fill="#C9B6E0" opacity=".7" />
          <path d="M40 120c20-40 40-20 50 10" stroke="#B8C9A8" strokeWidth="8" fill="none" strokeLinecap="round" />
          <circle cx="88" cy="88" r="6" fill="#E8A0B0" opacity=".7" />
        </svg>
      )
    case 'first-smile':
      return (
        <svg viewBox="0 0 320 200" className="illu" aria-hidden>
          <rect width="320" height="200" rx="12" fill="#F3EAF8" />
          <circle cx="160" cy="95" r="48" fill="#F6D9CE" />
          <circle cx="142" cy="90" r="4" fill="#6B5A55" />
          <circle cx="178" cy="90" r="4" fill="#6B5A55" />
          <path d="M145 108c8 10 22 10 30 0" stroke="#C97B6B" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="128" cy="100" r="8" fill="#F0B8A8" opacity=".45" />
          <circle cx="192" cy="100" r="8" fill="#F0B8A8" opacity=".45" />
          <path d="M110 55c20-25 80-25 100 0" stroke="#C9B6E0" strokeWidth="10" fill="none" strokeLinecap="round" />
          <circle cx="60" cy="50" r="10" fill="#FFE6A8" opacity=".8" />
          <circle cx="260" cy="150" r="14" fill="#B8D4E8" opacity=".5" />
        </svg>
      )
    case 'tiny-hands':
      return (
        <svg viewBox="0 0 320 200" className="illu" aria-hidden>
          <rect width="320" height="200" rx="12" fill="#EDE6F5" />
          <path
            d="M70 130c20-40 50-50 70-20 8-30 40-40 55-10 5-20 30-30 45-5 10-15 35-10 40 15v20H70z"
            fill="#F6D9CE"
          />
          <path d="M200 95c30 10 55 35 60 55" stroke="#E8C4B8" strokeWidth="14" fill="none" strokeLinecap="round" />
          <circle cx="248" cy="70" r="18" fill="#C9B6E0" opacity=".55" />
          <text x="240" y="76" fontSize="16" fill="#7A5F96" fontFamily="Caveat, cursive">
            ♡
          </text>
        </svg>
      )
    case 'garden':
      return (
        <svg viewBox="0 0 320 200" className="illu" aria-hidden>
          <defs>
            <linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DCE8F5" />
              <stop offset="100%" stopColor="#E8F0E0" />
            </linearGradient>
          </defs>
          <rect width="320" height="200" rx="12" fill="url(#gsky)" />
          <ellipse cx="160" cy="170" rx="130" ry="20" fill="#A8C090" opacity=".55" />
          <path d="M80 160c0-50 30-90 40-90s40 40 40 90" fill="#8FAE78" />
          <circle cx="100" cy="70" r="22" fill="#C9B6E0" opacity=".85" />
          <circle cx="220" cy="90" r="16" fill="#E8A0B0" opacity=".7" />
          <circle cx="250" cy="120" r="12" fill="#FFE6A8" opacity=".8" />
          <circle cx="150" cy="130" r="20" fill="#F6D9CE" />
          <circle cx="150" cy="112" r="12" fill="#F6D9CE" />
        </svg>
      )
    case 'first-steps':
      return (
        <svg viewBox="0 0 320 200" className="illu" aria-hidden>
          <rect width="320" height="200" rx="12" fill="#F5EDE4" />
          <rect x="40" y="150" width="240" height="10" rx="3" fill="#D9C8B0" opacity=".5" />
          <ellipse cx="130" cy="120" rx="18" ry="28" fill="#C9B6E0" />
          <circle cx="130" cy="85" r="14" fill="#F6D9CE" />
          <ellipse cx="118" cy="155" rx="10" ry="6" fill="#E8C4B8" />
          <ellipse cx="145" cy="155" rx="10" ry="6" fill="#E8C4B8" />
          <path d="M160 100c40 10 70 40 80 55" stroke="#B8A090" strokeWidth="3" fill="none" strokeDasharray="4 6" />
          <circle cx="250" cy="50" r="8" fill="#FFE6A8" />
        </svg>
      )
    case 'starry':
      return (
        <svg viewBox="0 0 320 200" className="illu" aria-hidden>
          <defs>
            <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2C2540" />
              <stop offset="100%" stopColor="#5A4A78" />
            </linearGradient>
          </defs>
          <rect width="320" height="200" rx="12" fill="url(#night)" />
          <circle cx="60" cy="40" r="2" fill="#FFE6A8" />
          <circle cx="120" cy="28" r="1.5" fill="#fff" />
          <circle cx="200" cy="50" r="2.5" fill="#FFE6A8" />
          <circle cx="260" cy="35" r="1.5" fill="#fff" />
          <circle cx="280" cy="80" r="2" fill="#E8DFF5" />
          <circle cx="90" cy="90" r="1.5" fill="#fff" />
          <path d="M200 40l2 6h6l-5 4 2 6-5-3-5 3 2-6-5-4h6z" fill="#FFE6A8" />
          <ellipse cx="160" cy="170" rx="90" ry="16" fill="#1E1830" opacity=".4" />
          <circle cx="140" cy="140" r="16" fill="#F6D9CE" />
          <path d="M120 155h50v20c-10 8-40 8-50 0z" fill="#C9B6E0" />
        </svg>
      )
    case 'birthday':
      return (
        <svg viewBox="0 0 320 200" className="illu" aria-hidden>
          <rect width="320" height="200" rx="12" fill="#F8EAF0" />
          <rect x="110" y="100" width="100" height="60" rx="8" fill="#C9B6E0" />
          <rect x="110" y="100" width="100" height="18" fill="#E8A0B0" />
          <rect x="155" y="72" width="6" height="28" fill="#F5EDE4" />
          <ellipse cx="158" cy="68" rx="6" ry="8" fill="#FFE6A8" />
          <circle cx="70" cy="60" r="8" fill="#B8D4E8" opacity=".7" />
          <circle cx="250" cy="70" r="10" fill="#FFE6A8" opacity=".7" />
          <circle cx="280" cy="120" r="7" fill="#C9B6E0" opacity=".6" />
          <text x="145" y="145" fontSize="22" fill="#7A5F96" fontFamily="Caveat, cursive">
            2
          </text>
        </svg>
      )
    case 'snow':
      return (
        <svg viewBox="0 0 320 200" className="illu" aria-hidden>
          <rect width="320" height="200" rx="12" fill="#E4ECF5" />
          <ellipse cx="160" cy="170" rx="120" ry="18" fill="#fff" opacity=".9" />
          <circle cx="150" cy="120" r="28" fill="#F6D9CE" />
          <path d="M120 130c10-40 50-40 60 0" fill="#C9B6E0" />
          <circle cx="150" cy="95" r="18" fill="#F6D9CE" />
          <ellipse cx="150" cy="82" rx="22" ry="10" fill="#E8DFF5" />
          <circle cx="60" cy="50" r="3" fill="#fff" />
          <circle cx="100" cy="40" r="2" fill="#fff" />
          <circle cx="200" cy="55" r="3" fill="#fff" />
          <circle cx="240" cy="35" r="2" fill="#fff" />
          <circle cx="280" cy="70" r="3" fill="#fff" />
          <circle cx="80" cy="90" r="2" fill="#fff" />
        </svg>
      )
  }
}
