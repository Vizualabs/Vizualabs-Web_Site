export function BlobMascotIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="blob-body" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFA36B" />
          <stop offset="55%" stopColor="#FF5E4D" />
          <stop offset="100%" stopColor="#E8482F" />
        </radialGradient>
      </defs>

      {/* side bumps */}
      <circle cx="12" cy="56" r="9" fill="url(#blob-body)" />
      <circle cx="88" cy="56" r="9" fill="url(#blob-body)" />

      {/* body */}
      <rect x="15" y="16" width="70" height="72" rx="32" ry="34" fill="url(#blob-body)" />

      {/* glossy highlight */}
      <ellipse cx="35" cy="32" rx="14" ry="9" fill="#FFFFFF" opacity="0.5" transform="rotate(-25 35 32)" />

      {/* blush */}
      <ellipse cx="25" cy="62" rx="7" ry="4" fill="#FFD9C7" opacity="0.55" />
      <ellipse cx="75" cy="62" rx="7" ry="4" fill="#FFD9C7" opacity="0.55" />

      {/* eyes */}
      <ellipse cx="38" cy="54" rx="4" ry="5.5" fill="#3A1408" />
      <ellipse cx="62" cy="54" rx="4" ry="5.5" fill="#3A1408" />

      {/* mouth */}
      <ellipse cx="50" cy="66" rx="3.2" ry="2.6" fill="#7A1F12" />
    </svg>
  )
}
