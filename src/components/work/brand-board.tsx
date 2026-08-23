import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * BrandBoard — generated SVG "brand board" visuals for the case-study page.
 *
 * These are vector compositions drawn from the approved Stratifit design
 * tokens (deep background, amber primary, indigo secondary) plus the client's
 * wordmark. Every section of the case study gets a cohesive, professional
 * visual even when no photograph has been uploaded yet.
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
  | "cta";

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

function Backdrop({ uid }: { uid: string }) {
  const gridLines = [
    ...Array.from({ length: 7 }, (_, i) => 150 * (i + 1)),
    ...Array.from({ length: 4 }, (_, i) => 150 * (i + 1)),
  ];
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.deep} />
          <stop offset="1" stopColor={C.bg} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.26" r="0.62">
          <stop offset="0" stopColor={C.primary} stopOpacity="0.16" />
          <stop offset="1" stopColor={C.primary} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="720" fill={`url(#${uid}-bg)`} />
      <rect width="1200" height="720" fill={`url(#${uid}-glow)`} />
      <g stroke="rgba(255,255,255,0.035)" strokeWidth="1">
        {gridLines.slice(0, 7).map((x, i) => (
          <line key={`v${i}`} x1={x} y1="0" x2={x} y2="720" />
        ))}
        {gridLines.slice(7).map((y, i) => (
          <line key={`h${i}`} x1="0" y1={y} x2="1200" y2={y} />
        ))}
      </g>
    </>
  );
}

/** Print-style crop marks in the four corners. */
function CornerTicks() {
  const t = 26;
  const L = 16;
  const paths = [
    `M ${t} ${t + L} V ${t} H ${t + L}`,
    `M ${1200 - t - L} ${t} H ${1200 - t} V ${t + L}`,
    `M ${1200 - t} ${720 - t - L} V ${720 - t} H ${1200 - t - L}`,
    `M ${t + L} ${720 - t} H ${t} V ${720 - t - L}`,
  ];
  return (
    <g stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" fill="none">
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

/** The brand monogram: ring + first letter + a check that closes the mark. */
function MarkGlyph({
  x,
  y,
  r,
  initial,
  ring = "rgba(255,255,255,0.22)",
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
      <circle cx={x} cy={y} r={r} fill="none" stroke={ring} strokeWidth={Math.max(2, r * 0.055)} />
      <circle cx={x} cy={y} r={r * 0.62} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <text
        x={x}
        y={y + r * 0.03}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_DISPLAY}
        fontWeight={700}
        fontSize={r * 1.02}
        fill={letter}
      >
        {initial}
      </text>
      <path
        d={`M ${x + r * 0.32} ${y + r * 0.6} l ${r * 0.2} ${r * 0.2} l ${r * 0.42} -${r * 0.5}`}
        stroke={check}
        strokeWidth={Math.max(2, r * 0.09)}
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
  tracking = 0.045,
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

function Skeleton({
  x,
  y,
  w,
  h = 10,
  fill = "rgba(255,255,255,0.08)",
  rx = 5,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  fill?: string;
  rx?: number;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} />;
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
          stroke={color === C.white ? C.borderStrong : "rgba(255,255,255,0.14)"}
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
      <Wordmark x={1136} y={74} text={wordmark} size={24} anchor="end" tracking={0.06} />
      <line x1="64" y1="104" x2="1136" y2="104" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
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
  const short = tagline && tagline.length > 78 ? `${tagline.slice(0, 75)}…` : tagline;
  return (
    <g>
      <Backdrop uid={uid} />
      <CornerTicks />
      <Caps x={600} y={140} text={label ?? "Brand Identity"} size={19} fill={C.subtle} tracking={11} anchor="middle" />
      <MarkGlyph x={600} y={300} r={122} initial={initial} />
      <Wordmark x={600} y={486} text={wordmark} size={112} />
      <g>
        <line x1="470" y1="560" x2="600" y2="560" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <rect x="596" y="556" width="8" height="8" fill={C.primary} transform="rotate(45 600 560)" />
        <line x1="600" y1="560" x2="730" y2="560" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      </g>
      {short ? (
        <text
          x={600}
          y={610}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={FONT_BODY}
          fontSize={22}
          fill={C.text2}
        >
          {short}
        </text>
      ) : null}
      <PaletteDots x={80} y={668} />
      <Caps x={1120} y={668} text="Case Study 01" fill={C.subtle} tracking={5} anchor="end" />
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
  return (
    <g>
      <Backdrop uid={uid} />
      <CornerTicks />
      <Header index="01" text="Project Context" wordmark={wordmark} />
      {/* Left — brand anchor card */}
      <rect x="64" y="150" width="380" height="420" rx="18" fill={C.surface} stroke={C.border} strokeWidth="1" />
      <Caps x={92} y={182} text="The Brand" size={13} fill={C.text2} tracking={4} />
      <MarkGlyph x={254} y={285} r={72} initial={initial} />
      <Wordmark x={254} y={420} text={wordmark} size={38} />
      <Skeleton x={150} y={468} w={208} h={10} />
      <Skeleton x={150} y={492} w={160} h={10} />
      {/* Right — research rows */}
      {[
        { label: "Research", w: 400 },
        { label: "Audience", w: 330 },
        { label: "Market", w: 280 },
      ].map((row, i) => {
        const y = 172 + i * 132;
        return (
          <g key={row.label}>
            <rect x={492} y={y} width="30" height="30" rx="8" fill={i === 2 ? "rgba(245,158,11,0.14)" : C.soft} stroke={i === 2 ? "rgba(245,158,11,0.4)" : C.border} strokeWidth="1" />
            <Caps x={540} y={y + 15} text={row.label} size={13} fill={C.text2} tracking={4} />
            <Skeleton x={540} y={y + 34} w={row.w} h={8} />
            <Skeleton x={540} y={y + 52} w={row.w * 0.72} h={8} />
          </g>
        );
      })}
      {/* Bottom strip */}
      <rect x="492" y="522" width="644" height="48" rx="12" fill={C.surface} stroke={C.border} strokeWidth="1" />
      <PaletteDots x={520} y={546} size={14} gap={12} />
      <Caps x={1108} y={546} text={wordmark} fill={C.text2} tracking={4} anchor="end" />
    </g>
  );
}

function PaletteBoard({ uid, wordmark }: { uid: string; wordmark: string }) {
  const swatches = [
    { name: "Background", hex: C.deep, color: C.deep },
    { name: "Surface", hex: C.surface, color: C.surface },
    { name: "Primary", hex: C.primary, color: C.primary },
    { name: "Secondary", hex: C.secondary, color: C.secondary },
    { name: "Text", hex: C.white, color: C.white },
  ];
  const step = 224;
  return (
    <g>
      <Backdrop uid={uid} />
      <CornerTicks />
      <Header index="02" text="Color System" wordmark={wordmark} />
      {swatches.map((s, i) => {
        const x = 64 + i * step;
        return (
          <g key={s.name}>
            <rect x={x} y={150} width={200} height={380} rx={14} fill={s.color} stroke={s.color === C.white ? C.borderStrong : "rgba(255,255,255,0.12)"} strokeWidth="1" />
            <Caps x={x + 100} y={566} text={s.name} size={14} fill={C.text2} tracking={3} anchor="middle" />
            <text
              x={x + 100}
              y={596}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_BODY}
              fontSize={19}
              fontWeight={600}
              fill={C.muted}
            >
              {s.hex}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function TypeBoard({ uid, wordmark }: { uid: string; wordmark: string }) {
  return (
    <g>
      <Backdrop uid={uid} />
      <CornerTicks />
      <Header index="03" text="Typography" wordmark={wordmark} />
      {/* Display specimen */}
      <text
        x={250}
        y={330}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_DISPLAY}
        fontWeight={700}
        fontSize={330}
        fill={C.white}
      >
        Aa
      </text>
      <Caps x={250} y={560} text="Satoshi · Display" size={15} fill={C.text2} tracking={5} anchor="middle" />
      {/* Wordmark + body specimen */}
      <Wordmark x={620} y={210} text={wordmark} size={78} anchor="start" tracking={0.03} />
      <Skeleton x={620} y={268} w={430} h={11} />
      <Skeleton x={620} y={296} w={330} h={11} />
      <Skeleton x={620} y={324} w={382} h={11} />
      <Caps x={620} y={410} text="Inter · Body & UI" size={14} fill={C.text2} tracking={5} />
      <text
        x={620}
        y={470}
        dominantBaseline="central"
        fontFamily={FONT_BODY}
        fontSize={30}
        fill={C.text2}
      >
        Aa Bb Cc Qq 123 — clear at every size.
      </text>
      {/* Letterform rail */}
      <line x1="620" y1="520" x2="1136" y2="520" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {["Aa", "Bb", "Cc", "Qq", "&", "01"].map((g, i) => (
        <text
          key={g}
          x={620 + i * 88}
          y={566}
          dominantBaseline="central"
          fontFamily={FONT_DISPLAY}
          fontWeight={700}
          fontSize={34}
          fill={i === 3 ? C.primary : C.text2}
        >
          {g}
        </text>
      ))}
    </g>
  );
}

function MarkBoard({ uid, wordmark, initial }: { uid: string; wordmark: string; initial: string }) {
  return (
    <g>
      <Backdrop uid={uid} />
      <CornerTicks />
      <Header index="04" text="Mark Construction" wordmark={wordmark} />
      <Caps x={600} y={130} text="Grid · Proportion · Gesture" size={14} fill={C.text2} tracking={6} anchor="middle" />
      {/* Construction guides */}
      <g stroke="rgba(255,255,255,0.09)" strokeWidth="1" fill="none">
        <line x1="330" y1="360" x2="870" y2="360" />
        <line x1="600" y1="170" x2="600" y2="550" />
        <line x1="402" y1="162" x2="798" y2="558" />
        <line x1="798" y1="162" x2="402" y2="558" />
      </g>
      <circle cx="600" cy="360" r="218" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <circle cx="600" cy="360" r="172" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" strokeDasharray="5 9" />
      <circle cx="600" cy="360" r="140" fill="none" stroke="rgba(245,158,11,0.35)" strokeWidth="1" />
      <MarkGlyph x={600} y={360} r={104} initial={initial} ring="rgba(245,158,11,0.55)" />
      {/* Intersection markers */}
      {[
        [382, 142],
        [818, 142],
        [382, 578],
        [818, 578],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={C.primary} />
      ))}
      <Caps x={64} y={620} text="01 · Geometry" size={13} fill={C.text2} tracking={4} />
      <Caps x={1136} y={620} text="02 · Readable at a glance" size={13} fill={C.text2} tracking={4} anchor="end" />
    </g>
  );
}

function PatternBoard({ uid, wordmark, initial }: { uid: string; wordmark: string; initial: string }) {
  const cols = [64, 248, 432, 616, 800, 984];
  const rows = [140, 310, 480];
  return (
    <g>
      <Backdrop uid={uid} />
      <CornerTicks />
      <Header index="05" text="Pattern" wordmark={wordmark} />
      {rows.map((y, r) =>
        cols.map((x, c) => {
          const accent = r === 1 && c === 2;
          const stroke = r === 1 && c === 4;
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={x}
                y={y}
                width="168"
                height="150"
                rx="12"
                fill={accent ? C.primary : c % 2 === 0 ? C.surface : "rgba(17,24,39,0.55)"}
                stroke={stroke ? "rgba(245,158,11,0.6)" : C.border}
                strokeWidth={stroke ? 2 : 1}
              />
              <MarkGlyph
                x={x + 84}
                y={y + 75}
                r={36}
                initial={initial}
                ring={accent ? "rgba(10,10,10,0.35)" : "rgba(255,255,255,0.14)"}
                letter={accent ? "#0A0A0A" : r === 1 ? C.primary : "rgba(255,255,255,0.5)"}
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
  const outline = "rgba(255,255,255,0.42)";
  const sw = 3;
  return (
    <g>
      <Backdrop uid={uid} />
      <CornerTicks />
      <Header index="06" text="Applications" wordmark={wordmark} />
      {tiles.map((tile, i) => {
        const cx = tile.x + 176;
        const cy = tile.y + 92;
        return (
          <g key={tile.label}>
            <rect x={tile.x} y={tile.y} width="352" height="200" rx="14" fill={C.surface} stroke={C.border} strokeWidth="1" />
            <MarkGlyph x={tile.x + 312} y={tile.y + 42} r={20} initial={initial} ring="rgba(255,255,255,0.18)" letter={C.primary} />
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
                <rect x="-72" y="-16" width="144" height="58" rx="10" />
                <rect x="-42" y="-54" width="90" height="40" rx="9" />
                <rect x="-30" y="-44" width="30" height="20" rx="5" stroke="rgba(255,255,255,0.25)" />
                <rect x="8" y="-44" width="24" height="20" rx="5" stroke="rgba(255,255,255,0.25)" />
                <circle cx="-38" cy="54" r="13" />
                <circle cx="38" cy="54" r="13" />
              </g>
            ) : null}
            {i === 2 ? (
              <g transform={`translate(${cx} ${cy - 8})`} fill="none" stroke={outline} strokeWidth={sw}>
                <rect x="-30" y="-58" width="60" height="116" rx="14" />
                <rect x="-24" y="-50" width="48" height="84" rx="6" stroke="rgba(255,255,255,0.25)" />
                <circle cx="0" cy="-42" r="2.5" fill="rgba(255,255,255,0.4)" stroke="none" />
                <MarkGlyph x={0} y={8} r={14} initial={initial} ring="rgba(245,158,11,0.5)" letter={C.primary} />
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
                <rect x="-5" y="22" width="10" height="58" />
                <rect x="-64" y="-54" width="128" height="76" rx="8" />
                <MarkGlyph x={-36} y={-16} r={18} initial={initial} ring="rgba(245,158,11,0.5)" letter={C.primary} />
                <line x1="-8" y1="-34" x2="48" y2="-34" stroke="rgba(255,255,255,0.3)" strokeWidth={sw} />
              </g>
            ) : null}
            {i === 5 ? (
              <g transform={`translate(${cx} ${cy - 8})`} fill="none" stroke={outline} strokeWidth={sw}>
                <rect x="-70" y="-46" width="140" height="92" rx="12" />
                <rect x="-52" y="-22" width="78" height="7" rx="3.5" fill="rgba(255,255,255,0.22)" stroke="none" />
                <rect x="-52" y="-5" width="56" height="7" rx="3.5" fill="rgba(255,255,255,0.12)" stroke="none" />
                <MarkGlyph x={40} y={12} r={16} initial={initial} ring="rgba(245,158,11,0.5)" letter={C.primary} />
              </g>
            ) : null}
            <Caps x={tile.x + 20} y={tile.y + 168} text={tile.label} size={12} fill={C.text2} tracking={3} />
          </g>
        );
      })}
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
      <CornerTicks />
      <MarkGlyph x={290} y={250} r={104} initial={initial} />
      <Wordmark x={290} y={420} text={wordmark} size={58} />
      <Caps x={290} y={474} text="Brand System" size={14} fill={C.text2} tracking={5} anchor="middle" />
      {/* Metrics */}
      {(metrics ?? []).slice(0, 3).map((m, i) => {
        const y = 160 + i * 122;
        return (
          <g key={i}>
            <rect x={540} y={y} width="560" height="92" rx="16" fill={C.surface} stroke={C.border} strokeWidth="1" />
            <text
              x={580}
              y={y + 40}
              dominantBaseline="central"
              fontFamily={FONT_DISPLAY}
              fontWeight={900}
              fontSize={44}
              fill={C.primary}
            >
              {m.value}
            </text>
            <Caps x={580} y={y + 68} text={m.label} size={13} fill={C.muted} tracking={3} />
            <line x1="760" y1={y + 18} x2="760" y2={y + 74} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </g>
        );
      })}
      <line x1="64" y1="600" x2="1136" y2="600" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <PaletteDots x={64} y={652} size={14} gap={12} />
      <Caps x={1136} y={652} text="One identity · Every touchpoint" size={13} fill={C.subtle} tracking={4} anchor="end" />
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
      <CornerTicks />
      <MarkGlyph x={600} y={218} r={86} initial={initial} />
      <Wordmark x={600} y={360} text={wordmark} size={84} />
      {label ? (
        <Caps x={600} y={420} text={label} size={14} fill={C.text2} tracking={6} anchor="middle" />
      ) : null}
      <g>
        <line x1="480" y1="466" x2="600" y2="466" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <rect x="596" y="462" width="8" height="8" fill={C.primary} transform="rotate(45 600 466)" />
        <line x1="600" y1="466" x2="720" y2="466" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
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
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      {variant === "hero" ? (
        <HeroBoard uid={uid} wordmark={wordmark} initial={initial} label={label} tagline={tagline} />
      ) : variant === "overview" ? (
        <OverviewBoard uid={uid} wordmark={wordmark} initial={initial} />
      ) : variant === "palette" ? (
        <PaletteBoard uid={uid} wordmark={wordmark} />
      ) : variant === "type" ? (
        <TypeBoard uid={uid} wordmark={wordmark} />
      ) : variant === "mark" ? (
        <MarkBoard uid={uid} wordmark={wordmark} initial={initial} />
      ) : variant === "pattern" ? (
        <PatternBoard uid={uid} wordmark={wordmark} initial={initial} />
      ) : variant === "applications" ? (
        <ApplicationsBoard uid={uid} wordmark={wordmark} initial={initial} />
      ) : variant === "results" ? (
        <ResultsBoard uid={uid} wordmark={wordmark} initial={initial} metrics={metrics} />
      ) : (
        <CtaBoard uid={uid} wordmark={wordmark} initial={initial} label={label} />
      )}
    </svg>
  );
}
