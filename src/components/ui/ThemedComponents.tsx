import { useState, useEffect } from "react";
import { type Theme } from "../../types/finance";
import { FONT, MONO } from "../../constants/styles";

/* ═══ Confetti Animation ═══ */
export function Confetti({
  active,
  onDone,
}: {
  active: boolean;
  onDone?: () => void;
}) {
  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    if (!active) return;
    const p = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 60,
      color: ["#2563EB", "#059669", "#D97706", "#DC2626", "#7C3AED", "#F59E0B"][
        i % 6
      ],
      delay: Math.random() * 0.3,
      size: 4 + Math.random() * 6,
    }));
    setParticles(p);
    const t = setTimeout(() => {
      setParticles([]);
      onDone?.();
    }, 1500);
    return () => clearTimeout(t);
  }, [active]);

  if (!particles.length) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "40%",
            width: p.size,
            height: p.size,
            borderRadius: p.size > 7 ? "50%" : 1,
            background: p.color,
            opacity: 0,
            animation: `confettiFall 1.2s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══ CheckMark Pop ═══ */
export function CheckMark({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 9998,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#059669",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "checkPop .5s ease both",
          boxShadow: "0 8px 30px rgba(5,150,105,0.4)",
        }}
      >
        <span style={{ color: "#fff", fontSize: 36, fontWeight: 700 }}>✓</span>
      </div>
    </div>
  );
}

/* ═══ Card ═══ */
export function Card({
  title,
  children,
  actions,
  T,
}: {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  T: Theme;
}) {
  return (
    <div
      style={{
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        boxShadow: T.shadow,
        transition: "all .4s ease",
      }}
    >
      {title && (
        <div
          style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: T.text1,
              letterSpacing: -0.2,
            }}
          >
            {title}
          </span>
          {actions}
        </div>
      )}
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

/* ═══ Badge ═══ */
export function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
  T: Theme;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        background: `${color}15`,
        color,
        letterSpacing: 0.2,
      }}
    >
      {children}
    </span>
  );
}

/* ═══ Button ═══ */
export function Btn({
  children,
  primary,
  danger,
  small,
  onClick,
  disabled,
  T,
}: {
  children: React.ReactNode;
  primary?: boolean;
  danger?: boolean;
  small?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  T: Theme;
}) {
  const bg = primary ? T.primary : danger ? T.danger : "transparent";
  const c = primary || danger ? "#fff" : T.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? "6px 14px" : "10px 24px",
        borderRadius: 8,
        border: primary || danger ? "none" : `1px solid ${T.border}`,
        cursor: disabled ? "default" : "pointer",
        fontSize: small ? 12 : 13,
        fontWeight: 600,
        background: bg,
        color: c,
        opacity: disabled ? 0.4 : 1,
        fontFamily: FONT,
        transition: "all .2s ease",
        letterSpacing: 0.1,
      }}
    >
      {children}
    </button>
  );
}

/* ═══ Progress Bar ═══ */
export function Progress({
  value,
  max,
  color,
  height = 5,
  T,
}: {
  value: number;
  max: number;
  color: string;
  height?: number;
  T: Theme;
}) {
  const pct = Math.min(100, (value / (max || 1)) * 100);
  return (
    <div
      style={{
        height,
        borderRadius: height,
        background: T.border,
        overflow: "hidden",
        transition: "background .4s ease",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: color,
          borderRadius: height,
          transition: "all .5s ease",
        }}
      />
    </div>
  );
}

/* ═══ Fact Box ═══ */
export function Fact({
  label,
  value,
  sub,
  color,
  T,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  T: Theme;
}) {
  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: `1px solid ${T.border}`,
        transition: "border-color .4s ease",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: T.text3,
          marginBottom: 3,
          textTransform: "uppercase",
          letterSpacing: 1,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: color || T.text1,
          fontFamily: MONO,
          letterSpacing: -0.5,
          transition: "color .4s ease",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: T.text3, marginTop: 3 }}>{sub}</div>
      )}
    </div>
  );
}
