import { type Theme } from "../../models";
import { Badge } from "../ui/ThemedComponents";

interface Props {
  T: Theme;
  dark: boolean;
  setDark: (fn: (d: boolean) => boolean) => void;
  extraIncome: number;
  month: string;
  streak: number;
  avatarEmoji: string;
}

export function AppHeader({
  T,
  dark,
  setDark,
  extraIncome,
  month,
  streak,
  avatarEmoji,
}: Props) {
  return (
    <div
      style={{
        background: T.headerBg,
        borderBottom: `1px solid ${T.border}`,
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        height: 56,
        transition: "all .4s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: T.text1,
            letterSpacing: -0.5,
          }}
        >
          Zen<span style={{ color: T.primary }}>Money</span>
        </span>
        <span
          style={{
            fontSize: 11,
            color: T.text3,
            padding: "3px 10px",
            background: T.hoverBg,
            borderRadius: 6,
          }}
        >
          {month}
        </span>
        {extraIncome > 0 && (
          <Badge color={T.primary} T={T}>
            +{extraIncome}₼
          </Badge>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {streak > 0 && (
          <span style={{ fontSize: 12, color: T.warning, fontWeight: 600 }}>
            🔥 {streak}
          </span>
        )}

        <button
          onClick={() => setDark((d) => !d)}
          style={{
            width: 48,
            height: 26,
            borderRadius: 13,
            border: "none",
            cursor: "pointer",
            position: "relative",
            background: dark ? "#3FB950" : T.border,
            transition: "background .4s ease",
            padding: 0,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#fff",
              position: "absolute",
              top: 3,
              left: dark ? 25 : 3,
              transition: "left .4s ease",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
            }}
          >
            {dark ? "🌙" : "☀️"}
          </div>
        </button>

        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: T.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          {avatarEmoji}
        </div>
      </div>
    </div>
  );
}
