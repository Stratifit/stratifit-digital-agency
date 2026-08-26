import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * BrandBoard — generated SVG "brand board" visuals for the case-study page.
 *
 * Vector compositions drawn from the approved Stratifit design tokens (deep
 * background, amber primary, indigo secondary) plus the client's wordmark.
 * Every section of the case study gets a cohesive, professional visual even
 * when no photograph has been uploaded yet.
 *
 * The SVG is rendered with preserveAspectRatio="xMidYMid slice" so it fills
 * whatever frame the page gives it (hero, section figure, gallery tile).
 */

export type BrandBoardVariant =
  | "hero"
  | "overview"
  | "palette"
  | "type"
  | "mark"
  | "pattern"
  | "applications"
  | "results"
  | "cta"
  | "before"
  | "businesscard"
  | "solution"
  | "concept";

interface BrandBoardProps {
  variant: BrandBoardVariant;
  /** Client / brand wordmark — first letter is tinted amber. */
  wordmark: string;
  /** Small caps label (service or section name). */
  label?: string;
  /** Short line shown under the wordmark on cover boards. */
  tagline?: string;
  /** Resolved metric pairs for the results board. */
  metrics?: { value: string; label: string }[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */

const C = {
  deep: "#070A10",
  bg: "#0A0A0A",
  surface: "#111827",
  soft: "#151E2D",
  elevated: "#182235",
  border: "#1F2937",
  borderStrong: "#2B374A",
  primary: "#F59E0B",
  primaryLight: "#FBBF24",
  primaryDark: "#B45309",
  secondary: "#4F46E5",
  white: "#FFFFFF",
  text2: "#B8C0CC",
  muted: "#9CA3AF",
  subtle: "#6B7280",
};

const FONT_DISPLAY = "Satoshi, Inter, system-ui, sans-serif";
const FONT_BODY = "Inter, system-ui, sans-serif";

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

/** Deep gradient + soft amber glow + faint grid + edge vignette. */
function Backdrop({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.deep} />
          <stop offset="0.55" stopColor="#0B0E14" />
          <stop offset="1" stopColor={C.bg} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.3" r="0.55">
          <stop offset="0" stopColor={C.primary} stopOpacity="0.14" />
          <stop offset="1" stopColor={C.primary} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-vig`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.6" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.42" />
        </radialGradient>
      </defs>
      <rect width="1200" height="720" fill={`url(#${uid}-bg)`} />
      <rect width="1200" height="720" fill={`url(#${uid}-glow)`} />
      <g stroke="rgba(255,255,255,0.028)" strokeWidth="1">
        {Array.from({ length: 7 }, (_, i) => 150 * (i + 1)).map((x, i) => (
          <line key={`v${i}`} x1={x} y1="0" x2={x} y2="720" />
        ))}
        {Array.from({ length: 4 }, (_, i) => 150 * (i + 1)).map((y, i) => (
          <line key={`h${i}`} x1="0" y1={y} x2="1200" y2={y} />
        ))}
      </g>
      <rect width="1200" height="720" fill={`url(#${uid}-vig)`} />
    </>
  );
}

/** The brand monogram: ring + first letter + a check that closes the mark. */
function MarkGlyph({
  x,
  y,
  r,
  initial,
  ring = "rgba(255,255,255,0.24)",
  letter = C.primary,
  check = C.primary,
}: {
  x: number;
  y: number;
  r: number;
  initial: string;
  ring?: string;
  letter?: string;
  check?: string;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={ring} strokeWidth={Math.max(2, r * 0.045)} />
      <circle cx={x} cy={y} r={r * 0.66} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <text
        x={x}
        y={y + r * 0.03}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_DISPLAY}
        fontWeight={700}
        fontSize={r * 1.0}
        fill={letter}
      >
        {initial}
      </text>
      <path
        d={`M ${x + r * 0.34} ${y + r * 0.62} l ${r * 0.18} ${r * 0.18} l ${r * 0.4} -${r * 0.48}`}
        stroke={check}
        strokeWidth={Math.max(2, r * 0.075)}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** Wordmark text — first letter amber, remainder in the given fill. */
function Wordmark({
  x,
  y,
  text,
  size,
  fill = C.white,
  anchor = "middle",
  tracking = 0.06,
}: {
  x: number;
  y: number;
  text: string;
  size: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  tracking?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fontFamily={FONT_DISPLAY}
      fontWeight={900}
      fontSize={size}
      letterSpacing={size * tracking}
    >
      <tspan fill={C.primary}>{text.charAt(0)}</tspan>
      <tspan fill={fill}>{text.slice(1)}</tspan>
    </text>
  );
}

function Caps({
  x,
  y,
  text,
  size = 14,
  fill = C.muted,
  tracking = 4,
  anchor = "start",
}: {
  x: number;
  y: number;
  text: string;
  size?: number;
  fill?: string;
  tracking?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fontFamily={FONT_BODY}
      fontWeight={700}
      fontSize={size}
      letterSpacing={tracking}
      fill={fill}
    >
      {text.toUpperCase()}
    </text>
  );
}

function PaletteDots({
  x,
  y,
  size = 16,
  gap = 14,
}: {
  x: number;
  y: number;
  size?: number;
  gap?: number;
}) {
  const colors = [C.deep, C.surface, C.primary, C.secondary, C.white];
  return (
    <g>
      {colors.map((color, i) => (
        <circle
          key={i}
          cx={x + i * (size + gap)}
          cy={y}
          r={size / 2}
          fill={color}
          stroke={color === C.white ? C.borderStrong : "rgba(255,255,255,0.16)"}
          strokeWidth="1"
        />
      ))}
    </g>
  );
}

function Header({ index, text, wordmark }: { index: string; text: string; wordmark: string }) {
  return (
    <g>
      <Caps x={64} y={74} text={`${index} · ${text}`} size={15} fill={C.primary} tracking={5} />
      <Wordmark x={1136} y={74} text={wordmark} size={22} anchor="end" tracking={0.08} />
      <line x1="64" y1="102" x2="1136" y2="102" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

function HeroBoard({
  uid,
  wordmark,
  initial,
  label,
  tagline,
}: {
  uid: string;
  wordmark: string;
  initial: string;
  label?: string;
  tagline?: string;
}) {
  const short =
    tagline && tagline.length > 84
      ? `${tagline.slice(0, 81).replace(/\s+\S*$/, "")}…`
      : tagline;
  return (
    <g>
      <Backdrop uid={uid} />
      <Caps x={600} y={168} text={label ?? "Brand Identity"} size={18} fill={C.subtle} tracking={10} anchor="middle" />
      <MarkGlyph x={600} y={330} r={104} initial={initial} />
      <Wordmark x={600} y={492} text={wordmark} size={96} />
      <g>
        <line x1="500" y1="562" x2="600" y2="562" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <rect x="596" y="558" width="8" height="8" fill={C.primary} transform="rotate(45 600 562)" />
        <line x1="600" y1="562" x2="700" y2="562" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </g>
      {short ? (
        <text
          x={600}
          y={612}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={FONT_BODY}
          fontSize={21}
          fill={C.text2}
        >
          {short}
        </text>
      ) : null}
      <PaletteDots x={80} y={664} size={14} gap={12} />
    </g>
  );
}

function OverviewBoard({
  uid,
  wordmark,
  initial,
}: {
  uid: string;
  wordmark: string;
  initial: string;
}) {
  const rows = [
    { label: "Strategy", note: "Positioning · message · tone" },
    { label: "Identity", note: "Mark · color · type · pattern" },
    { label: "Launch", note: "Digital · print · field" },
  ];
  return (
    <g>
      <Backdrop uid={uid} />
      <Header index="01" text="Project Context" wordmark={wordmark} />
      {/* Left — brand anchor card */}
      <rect x="64" y="140" width="380" height="440" rx="18" fill={C.surface} stroke={C.border} strokeWidth="1" />
      <Caps x={92} y={172} text="The Brand" size={13} fill={C.text2} tracking={4} />
      <MarkGlyph x={254} y={280} r={66} initial={initial} />
      <Wordmark x={254} y={406} text={wordmark} size={34} />
      <line x1="170" y1="452" x2="338" y2="452" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <Caps x={254} y={478} text="Brand System" size={12} fill={C.subtle} tracking={4} anchor="middle" />
      {/* Right — research rows */}
      {rows.map((row, i) => {
        const y = 156 + i * 148;
        return (
          <g key={row.label}>
            <rect
              x={492}
              y={y}
              width="34"
              height="34"
              rx="9"
              fill={i === 2 ? "rgba(245,158,11,0.12)" : C.soft}
              stroke={i === 2 ? "rgba(245,158,11,0.45)" : C.border}
              strokeWidth="1"
            />
            <text
              x={509}
              y={y + 17}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_DISPLAY}
              fontWeight={900}
              fontSize={16}
              fill={i === 2 ? C.primary : C.text2}
            >
              {String(i + 1).padStart(2, "0")}
            </text>
            <Caps x={548} y={y + 13} text={row.label} size={14} fill={C.text2} tracking={4} />
            <text
              x={548}
              y={y + 40}
              dominantBaseline="central"
              fontFamily={FONT_BODY}
              fontSize={20}
              fill={C.muted}
            >
              {row.note}
            </text>
            <line
              x1="548"
              y1={y + 66}
              x2={i === 1 ? 920 : 1060}
              y2={y + 66}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          </g>
        );
      })}
      {/* Bottom strip */}
      <rect x="492" y="522" width="644" height="58" rx="14" fill={C.surface} stroke={C.border} strokeWidth="1" />
      <PaletteDots x={520} y={551} size={14} gap={12} />
      <Caps x={1108} y={551} text={wordmark} fill={C.text2} tracking={4} anchor="end" />
    </g>
  );
}

function PaletteBoard() {
  return (
    <g>
      {/* Full-bleed swatches keep the palette focused and remove the inset frame. */}
      <rect width="1200" height="360" fill="#07742F" />
      <rect y="360" width="400" height="360" fill="#F2E543" />
      <rect x="400" y="360" width="400" height="360" fill="#18211C" />
      <rect x="800" y="360" width="400" height="360" fill="#F3F8EE" />

      <text
        x={88}
        y={222}
        fontFamily={FONT_BODY}
        fontWeight={800}
        fontSize={42}
        fill="#FFFFFF"
      >
        Primary: Green
      </text>
      <text
        x={88}
        y={272}
        fontFamily={FONT_BODY}
        fontWeight={600}
        fontSize={29}
        fill="#F2E543"
      >
        #07742F
      </text>

      <g fontFamily={FONT_BODY} fontWeight={700} fontSize={32}>
        <text x={80} y={494} fill="#18211C">Accent: Lemon</text>
        <text x={438} y={494} fill="#F3F8EE">Background: Mist</text>
        <text x={797} y={494} fill="#18211C">Text: Charcoal</text>
      </g>
      <g fontFamily={FONT_BODY} fontWeight={500} fontSize={28}>
        <text x={80} y={548} fill="#18211C">#F2E543</text>
        <text x={438} y={548} fill="#F3F8EE">#18211C</text>
        <text x={797} y={548} fill="#18211C">#F3F8EE</text>
      </g>
    </g>
  );
}

function TypeBoard() {
  return (
    <g>
      <rect width="1200" height="720" fill="#202223" />
      <Caps x={105} y={78} text="Typography" size={19} fill="#D7C8B8" tracking={6} />
      <text x={105} y={300} fontFamily={FONT_DISPLAY} fontWeight={900} fontSize="250" fill={C.primary}>Aa</text>
      <text x={105} y={390} fontFamily={FONT_DISPLAY} fontWeight={900} fontSize="48" fill={C.white}>Clenqo Sans</text>
      <text x={105} y={448} fontFamily={FONT_BODY} fontSize="24" fill="#AAA9A6">A custom-tuned grotesque typeface designed</text>
      <text x={105} y={480} fontFamily={FONT_BODY} fontSize="24" fill="#AAA9A6">for maximum clarity in high-pressure service</text>
      <text x={105} y={512} fontFamily={FONT_BODY} fontSize="24" fill="#AAA9A6">environments.</text>
      <line x1="105" y1="570" x2="1095" y2="570" stroke="#171717" strokeWidth="2" />
      <text x={105} y={630} fontFamily={FONT_DISPLAY} fontWeight={700} fontSize="56" fill="#E4E4E4">Aa</text>
      <text x={360} y={606} fontFamily={FONT_BODY} fontWeight={700} fontSize="25" fill="#E4E4E4">Hanken Grotesk</text>
      <text x={360} y={642} fontFamily={FONT_BODY} fontSize="21" fill="#D7C8B8">Primary Display / Bold, Modern, Sharp</text>
      <line x1="105" y1="680" x2="1095" y2="680" stroke="#171717" strokeWidth="2" />
    </g>
  );
}

function MarkBoard({ uid, wordmark, initial }: { uid: string; wordmark: string; initial: string }) {
  return (
    <g>
      <Backdrop uid={uid} />
      <Header index="04" text="Mark Construction" wordmark={wordmark} />
      <Caps x={600} y={138} text="Grid · Proportion · Gesture" size={14} fill={C.text2} tracking={6} anchor="middle" />
      {/* Construction guides */}
      <g stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none">
        <line x1="380" y1="360" x2="820" y2="360" />
        <line x1="600" y1="180" x2="600" y2="540" />
      </g>
      <circle cx="600" cy="360" r="200" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <circle cx="600" cy="360" r="156" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1" strokeDasharray="4 10" />
      <circle cx="600" cy="360" r="120" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <MarkGlyph x={600} y={360} r={92} initial={initial} ring="rgba(245,158,11,0.6)" />
      {/* Guide ticks at 45° */}
      {[45, 135, 225, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 600 + 156 * Math.cos(rad);
        const y1 = 360 + 156 * Math.sin(rad);
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x1 + 18 * Math.cos(rad)}
            y2={y1 + 18 * Math.sin(rad)}
            stroke="rgba(245,158,11,0.55)"
            strokeWidth="2"
          />
        );
      })}
      <Caps x={64} y={612} text="01 · Geometry" size={13} fill={C.text2} tracking={4} />
      <Caps x={1136} y={612} text="02 · Readable at a glance" size={13} fill={C.text2} tracking={4} anchor="end" />
    </g>
  );
}

function PatternBoard({ uid, wordmark, initial }: { uid: string; wordmark: string; initial: string }) {
  const cols = [64, 344, 624, 904];
  const rows = [140, 390];
  return (
    <g>
      <Backdrop uid={uid} />
      <Header index="05" text="Pattern" wordmark={wordmark} />
      {rows.map((y, r) =>
        cols.map((x, c) => {
          const accent = r === 0 && c === 2;
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={x}
                y={y}
                width="260"
                height="210"
                rx="16"
                fill={accent ? C.primary : c % 2 === 0 ? C.surface : "rgba(17,24,39,0.5)"}
                stroke={C.border}
                strokeWidth="1"
              />
              <MarkGlyph
                x={x + 130}
                y={y + 105}
                r={52}
                initial={initial}
                ring={accent ? "rgba(10,10,10,0.35)" : "rgba(255,255,255,0.14)"}
                letter={accent ? "#0A0A0A" : r === 0 ? C.primary : "rgba(255,255,255,0.55)"}
                check={accent ? "#0A0A0A" : C.primary}
              />
            </g>
          );
        })
      )}
    </g>
  );
}

function ApplicationsBoard({ uid, wordmark, initial }: { uid: string; wordmark: string; initial: string }) {
  const tiles = [
    { x: 64, y: 140, label: "Uniform" },
    { x: 432, y: 140, label: "Vehicle" },
    { x: 800, y: 140, label: "Digital" },
    { x: 64, y: 380, label: "Product" },
    { x: 432, y: 380, label: "Signage" },
    { x: 800, y: 380, label: "Comms" },
  ];
  const outline = "rgba(255,255,255,0.5)";
  const sw = 2.5;
  return (
    <g>
      <Backdrop uid={uid} />
      <Header index="06" text="Applications" wordmark={wordmark} />
      {tiles.map((tile, i) => {
        const cx = tile.x + 176;
        const cy = tile.y + 92;
        return (
          <g key={tile.label}>
            <rect x={tile.x} y={tile.y} width="352" height="200" rx="14" fill={C.surface} stroke={C.border} strokeWidth="1" />
            <MarkGlyph x={tile.x + 312} y={tile.y + 42} r={20} initial={initial} ring="rgba(255,255,255,0.2)" letter={C.primary} />
            {/* Silhouette per touchpoint */}
            {i === 0 ? (
              <path
                d="M -58 30 L -44 -26 L -14 -16 L 0 -44 L 14 -16 L 44 -26 L 58 30 L 32 52 L -32 52 Z"
                transform={`translate(${cx} ${cy - 8})`}
                fill="none"
                stroke={outline}
                strokeWidth={sw}
                strokeLinejoin="round"
              />
            ) : null}
            {i === 1 ? (
              <g transform={`translate(${cx} ${cy - 8})`} fill="none" stroke={outline} strokeWidth={sw}>
                <rect x="-72" y="-16" width="144" height="56" rx="10" />
                <rect x="-42" y="-52" width="88" height="38" rx="9" />
                <rect x="-30" y="-42" width="28" height="18" rx="5" stroke="rgba(255,255,255,0.28)" />
                <rect x="6" y="-42" width="22" height="18" rx="5" stroke="rgba(255,255,255,0.28)" />
                <circle cx="-38" cy="52" r="12" />
                <circle cx="38" cy="52" r="12" />
              </g>
            ) : null}
            {i === 2 ? (
              <g transform={`translate(${cx} ${cy - 8})`} fill="none" stroke={outline} strokeWidth={sw}>
                <rect x="-30" y="-58" width="60" height="116" rx="14" />
                <rect x="-23" y="-49" width="46" height="78" rx="6" stroke="rgba(255,255,255,0.28)" />
                <circle cx="0" cy="-41" r="2.5" fill="rgba(255,255,255,0.45)" stroke="none" />
                <MarkGlyph x={0} y={-6} r={13} initial={initial} ring="rgba(245,158,11,0.55)" letter={C.primary} />
              </g>
            ) : null}
            {i === 3 ? (
              <g transform={`translate(${cx} ${cy - 8})`} fill="none" stroke={outline} strokeWidth={sw}>
                <rect x="-18" y="-62" width="36" height="20" rx="4" />
                <rect x="-38" y="-42" width="76" height="112" rx="14" />
                <rect x="-38" y="-14" width="76" height="30" fill={C.primary} stroke="none" />
                <text
                  x="0"
                  y="2"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily={FONT_DISPLAY}
                  fontWeight={800}
                  fontSize={17}
                  fill="#0A0A0A"
                >
                  {initial}
                </text>
              </g>
            ) : null}
            {i === 4 ? (
              <g transform={`translate(${cx} ${cy - 8})`} fill="none" stroke={outline} strokeWidth={sw}>
                <rect x="-5" y="20" width="10" height="58" />
                <rect x="-64" y="-54" width="128" height="74" rx="8" />
                <MarkGlyph x={-34} y={-17} r={18} initial={initial} ring="rgba(245,158,11,0.55)" letter={C.primary} />
                <line x1="-8" y1="-34" x2="46" y2="-34" stroke="rgba(255,255,255,0.3)" strokeWidth={sw} />
              </g>
            ) : null}
            {i === 5 ? (
              <g transform={`translate(${cx} ${cy - 8})`} fill="none" stroke={outline} strokeWidth={sw}>
                <rect x="-70" y="-46" width="140" height="92" rx="12" />
                <rect x="-52" y="-22" width="78" height="7" rx="3.5" fill="rgba(255,255,255,0.22)" stroke="none" />
                <rect x="-52" y="-5" width="56" height="7" rx="3.5" fill="rgba(255,255,255,0.12)" stroke="none" />
                <MarkGlyph x={40} y={12} r={16} initial={initial} ring="rgba(245,158,11,0.55)" letter={C.primary} />
              </g>
            ) : null}
            <Caps x={tile.x + 20} y={tile.y + 170} text={tile.label} size={12} fill={C.text2} tracking={3} />
          </g>
        );
      })}
    </g>
  );
}

/**
 * BeforeBoard — the "previous identity" visual from the rollout mock: a solid
 * client-brand green banner carrying the white wordmark and tagline, standing
 * in for the old identity that the case study replaced.
 */
function BeforeBoard({
  uid,
  wordmark,
  tagline,
}: {
  uid: string;
  wordmark: string;
  tagline?: string;
}) {
  const short =
    tagline && tagline.length > 84
      ? `${tagline.slice(0, 81).replace(/\s+\S*$/, "")}…`
      : tagline;
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-before`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#22C55E" />
          <stop offset="1" stopColor="#15803D" />
        </linearGradient>
        <radialGradient id={`${uid}-before-glow`} cx="0.5" cy="0.3" r="0.65">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.12" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="720" fill={`url(#${uid}-before)`} />
      <rect width="1200" height="720" fill={`url(#${uid}-before-glow)`} />
      <circle
        cx={600}
        cy={318}
        r={196}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      <text
        x={600}
        y={306}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_DISPLAY}
        fontWeight={900}
        fontSize={96}
        letterSpacing={6}
        fill={C.white}
      >
        {wordmark}
      </text>
      <line
        x1="470"
        y1="388"
        x2="730"
        y2="388"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />
      {short ? (
        <text
          x={600}
          y={434}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={FONT_BODY}
          fontSize={22}
          letterSpacing={0.5}
          fill="rgba(255,255,255,0.8)"
        >
          {short}
        </text>
      ) : null}
    </g>
  );
}

/**
 * SolutionBoard — the new mark: a solid amber seal with the initial, and the
 * wordmark set beneath it. The anchor visual of the redesigned identity.
 */
function SolutionBoard({
  uid,
  wordmark,
  initial,
}: {
  uid: string;
  wordmark: string;
  initial: string;
}) {
  return (
    <g>
      <Backdrop uid={uid} />
      <circle cx={600} cy={320} r={150} fill={C.primary} />
      <circle cx={600} cy={320} r={150} fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="2" />
      <circle
        cx={600}
        cy={320}
        r={122}
        fill="none"
        stroke="rgba(10,10,10,0.18)"
        strokeWidth="1.5"
        strokeDasharray="3 8"
      />
      <text
        x={600}
        y={322}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_DISPLAY}
        fontWeight={900}
        fontSize={150}
        fill="#0A0A0A"
      >
        {initial}
      </text>
      <Wordmark x={600} y={532} text={wordmark} size={68} />
      <Caps x={600} y={588} text="Brand System" size={13} fill={C.text2} tracking={6} anchor="middle" />
    </g>
  );
}

/**
 * ConceptBoard — the mark's idea in one gesture: a circular construction with
 * the C and Q glyphs flanking a continuous loop.
 */
function ConceptBoard({ uid, wordmark }: { uid: string; wordmark: string }) {
  return (
    <g>
      <Backdrop uid={uid} />
      <Caps x={600} y={140} text="Mark Geometry" size={15} fill={C.subtle} tracking={8} anchor="middle" />
      <circle cx={600} cy={360} r={150} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <circle
        cx={600}
        cy={360}
        r={120}
        fill="none"
        stroke="rgba(245,158,11,0.35)"
        strokeWidth="1.5"
        strokeDasharray="4 10"
      />
      <text
        x={430}
        y={360}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_DISPLAY}
        fontWeight={900}
        fontSize={56}
        fill={C.primary}
        opacity={0.9}
      >
        C
      </text>
      <text
        x={770}
        y={360}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_DISPLAY}
        fontWeight={900}
        fontSize={56}
        fill={C.primary}
        opacity={0.9}
      >
        Q
      </text>
      {/* Continuous loop — the refresh gesture of the mark */}
      <g transform="translate(504 264) scale(8)">
        <path
          d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
          fill={C.primary}
        />
      </g>
      <Caps x={600} y={610} text={`${wordmark} · C + Q`} size={13} fill={C.text2} tracking={5} anchor="middle" />
    </g>
  );
}

/**
 * BusinessCardBoard — the "physical touchpoint" mockup from the rollout doc:
 * a dark-green card tucked diagonally behind a white business card carrying
 * placeholder contact lines and the yellow check badge.
 */
function BusinessCardBoard({
  uid,
  wordmark,
}: {
  uid: string;
  wordmark: string;
}) {
  return (
    <g>
      <Backdrop uid={uid} />
      {/* Green card — offset behind the white card */}
      <g transform="translate(46 66) rotate(-8 600 360)">
        <rect x="330" y="180" width="560" height="360" rx="22" fill="#0B5329" />
        <rect
          x="330"
          y="180"
          width="560"
          height="360"
          rx="22"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <text
          x={610}
          y={372}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={FONT_DISPLAY}
          fontWeight={900}
          fontSize={44}
          letterSpacing={8}
          fill="rgba(255,255,255,0.85)"
        >
          {wordmark}
        </text>
      </g>
      {/* White business card */}
      <rect x="330" y="180" width="560" height="360" rx="18" fill="#FFFFFF" />
      <rect
        x="330"
        y="180"
        width="560"
        height="360"
        rx="18"
        fill="none"
        stroke="rgba(10,10,10,0.08)"
        strokeWidth="1"
      />
      {/* Name + role */}
      <text
        x={382}
        y={244}
        dominantBaseline="central"
        fontFamily={FONT_DISPLAY}
        fontWeight={800}
        fontSize={38}
        fill="#0A0A0A"
      >
        Jane Doe
      </text>
      <text
        x={382}
        y={292}
        dominantBaseline="central"
        fontFamily={FONT_BODY}
        fontWeight={600}
        fontSize={21}
        fill="#5B6472"
      >
        Service Director
      </text>
      {/* Contact */}
      <text
        x={382}
        y={470}
        dominantBaseline="central"
        fontFamily={FONT_BODY}
        fontWeight={600}
        fontSize={23}
        fill="#0A0A0A"
      >
        +1 234 567 8900
      </text>
      <text
        x={382}
        y={506}
        dominantBaseline="central"
        fontFamily={FONT_BODY}
        fontSize={21}
        fill="#5B6472"
      >
        jane@clenqo.com
      </text>
      {/* Yellow check badge */}
      <rect x={770} y={448} width={88} height={88} rx={16} fill={C.primary} />
      <path
        d="M 794 500 l 18 18 l 38 -44"
        stroke="#0A0A0A"
        strokeWidth={9}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function ResultsBoard({
  uid,
  wordmark,
  initial,
  metrics,
}: {
  uid: string;
  wordmark: string;
  initial: string;
  metrics?: { value: string; label: string }[];
}) {
  return (
    <g>
      <Backdrop uid={uid} />
      <MarkGlyph x={290} y={240} r={92} initial={initial} />
      <Wordmark x={290} y={392} text={wordmark} size={52} />
      <Caps x={290} y={440} text="Brand System" size={14} fill={C.text2} tracking={5} anchor="middle" />
      {/* Metrics */}
      {(metrics ?? []).slice(0, 3).map((m, i) => {
        const y = 148 + i * 122;
        return (
          <g key={i}>
            <rect x={540} y={y} width="560" height="92" rx="16" fill={C.surface} stroke={C.border} strokeWidth="1" />
            <text
              x={580}
              y={y + 38}
              dominantBaseline="central"
              fontFamily={FONT_DISPLAY}
              fontWeight={900}
              fontSize={42}
              fill={C.primary}
            >
              {m.value}
            </text>
            <Caps x={580} y={y + 66} text={m.label} size={13} fill={C.muted} tracking={3} />
            <line x1="760" y1={y + 16} x2="760" y2={y + 76} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </g>
        );
      })}
      <line x1="64" y1="600" x2="1136" y2="600" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <PaletteDots x={64} y={648} size={14} gap={12} />
      <Caps x={1136} y={648} text={wordmark} size={13} fill={C.subtle} tracking={4} anchor="end" />
    </g>
  );
}

function CtaBoard({
  uid,
  wordmark,
  initial,
  label,
}: {
  uid: string;
  wordmark: string;
  initial: string;
  label?: string;
}) {
  return (
    <g>
      <Backdrop uid={uid} />
      <MarkGlyph x={600} y={230} r={80} initial={initial} />
      <Wordmark x={600} y={372} text={wordmark} size={76} />
      {label ? (
        <Caps x={600} y={428} text={label} size={14} fill={C.text2} tracking={6} anchor="middle" />
      ) : null}
      <g>
        <line x1="500" y1="472" x2="600" y2="472" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <rect x="596" y="468" width="8" height="8" fill={C.primary} transform="rotate(45 600 472)" />
        <line x1="600" y1="472" x2="700" y2="472" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </g>
      <rect x="480" y="506" width="240" height="54" rx="27" fill={C.primary} />
      <text
        x={600}
        y={534}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_BODY}
        fontWeight={800}
        fontSize={15}
        letterSpacing={2}
        fill="#0A0A0A"
      >
        START A PROJECT
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */

export function BrandBoard({
  variant,
  wordmark,
  label,
  tagline,
  metrics,
  className,
}: BrandBoardProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const initial = (wordmark || "B").trim().charAt(0).toUpperCase() || "B";

  return (
    <svg
      viewBox="0 0 1200 720"
      preserveAspectRatio={variant === "palette" ? "none" : "xMidYMid slice"}
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      {variant === "hero" ? (
        <HeroBoard uid={uid} wordmark={wordmark} initial={initial} label={label} tagline={tagline} />
      ) : variant === "overview" ? (
        <OverviewBoard uid={uid} wordmark={wordmark} initial={initial} />
      ) : variant === "palette" ? (
        <PaletteBoard />
      ) : variant === "type" ? (
        <TypeBoard />
      ) : variant === "mark" ? (
        <MarkBoard uid={uid} wordmark={wordmark} initial={initial} />
      ) : variant === "pattern" ? (
        <PatternBoard uid={uid} wordmark={wordmark} initial={initial} />
      ) : variant === "applications" ? (
        <ApplicationsBoard uid={uid} wordmark={wordmark} initial={initial} />
      ) : variant === "results" ? (
        <ResultsBoard uid={uid} wordmark={wordmark} initial={initial} metrics={metrics} />
      ) : variant === "before" ? (
        <BeforeBoard uid={uid} wordmark={wordmark} tagline={tagline} />
      ) : variant === "businesscard" ? (
        <BusinessCardBoard uid={uid} wordmark={wordmark} />
      ) : variant === "solution" ? (
        <SolutionBoard uid={uid} wordmark={wordmark} initial={initial} />
      ) : variant === "concept" ? (
        <ConceptBoard uid={uid} wordmark={wordmark} />
      ) : (
        <CtaBoard uid={uid} wordmark={wordmark} initial={initial} label={label} />
      )}
    </svg>
  );
}
