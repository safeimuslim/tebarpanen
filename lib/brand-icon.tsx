type BrandIconProps = {
  backgroundColor?: string
  borderRadius?: number
  iconColor?: string
  size?: number
}

export function BrandIcon({
  backgroundColor = "#0f9d8a",
  borderRadius = 28,
  iconColor = "#ffffff",
  size = 128,
}: BrandIconProps) {
  return (
    <svg
      fill="none"
      height={size}
      viewBox="0 0 128 128"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        fill={backgroundColor}
        height="112"
        rx={String(borderRadius)}
        width="112"
        x="8"
        y="8"
      />
      <g
        stroke={iconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 79.5c12.5-3 26-3 40.5 0" strokeWidth="4.5" />
        <path d="M18.5 91c15-4 31.5-4 48 0" strokeWidth="4.5" />
        <path d="M17 102.5c17.5-4.5 36.5-4.5 56 0" strokeWidth="4.5" />
        <path
          d="M69.5 39c10-5 24-3.5 35 4.5-6.5 10.5-19 17.5-32 19.5"
          strokeWidth="4.5"
        />
        <path d="M61 72c1-11.5 6-23 16-30" strokeWidth="4.5" />
        <path d="M61 72c7.5 3 14.5 8.5 20.5 16" strokeWidth="4.5" />
        <circle cx="89.5" cy="48" fill={iconColor} r="2.4" stroke="none" />
        <path d="M53.5 34.5l4 7.5" strokeWidth="4" />
        <path d="M64.5 29.5l1 8.5" strokeWidth="4" />
        <path d="M76.5 29.5l-2 8.5" strokeWidth="4" />
        <path d="M88.5 33.5l-4.5 7.5" strokeWidth="4" />
      </g>
    </svg>
  )
}
