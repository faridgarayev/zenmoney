import { useState } from "react";
import {
  type Theme,
  type TypeColors,
  type FinancialGoal,
} from "../../types/finance";
import { Card, Btn, Progress } from "../ui/ThemedComponents";
import { FONT, MONO, typeColorsFor } from "../../constants/styles";
import { goalCalc } from "../../utils/goalTimeCalculator";
import { GOAL_EMOJIS } from "../../constants/emojies";
import { themes } from "../../constants/themes";

/* ═══ Future Simulator Chart ═══ */
export function FutureSim({
  salary,
  futurePct,
  onPctChange,
  T,
}: {
  salary: number;
  futurePct: number;
  onPctChange?: (v: number) => void;
  T: Theme;
}) {
  const [pct, setPct] = useState(futurePct);
  const monthly = Math.round((salary * pct) / 100);
  const rate = 0.08,
    n = 12,
    years = [1, 2, 3, 5, 7, 10];
  const vals = years.map((t) =>
    Math.round(monthly * ((Math.pow(1 + rate / n, n * t) - 1) / (rate / n))),
  );
  const maxV = vals[vals.length - 1] || 1;
  const tc = typeColorsFor(T === themes.dark ? "dark" : "light");

  const handleChange = (v: number) => {
    setPct(v);
    onPctChange?.(v);
  };

  return (
    <div>
      <div
        style={{
          padding: "16px 18px",
          background: T.hoverBg,
          borderRadius: 10,
          marginBottom: 20,
          border: `1px solid ${T.border}`,
          transition: "all .4s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 13, color: T.text2 }}>Yığım faizi</span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 22,
              fontWeight: 700,
              color: tc.future,
            }}
          >
            {pct}%
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={60}
          value={pct}
          onChange={(e) => handleChange(Number(e.target.value))}
          style={{ width: "100%", accentColor: tc.future }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: T.text3,
            marginTop: 6,
          }}
        >
          <span>5%</span>
          <span>
            Aylıq: <strong style={{ color: tc.future }}>{monthly} ₼</strong>
          </span>
          <span>60%</span>
        </div>
      </div>

      <div
        style={{
          fontSize: 11,
          color: T.text3,
          marginBottom: 16,
          padding: "10px 14px",
          background: `${T.primary}08`,
          borderRadius: 8,
          border: `1px solid ${T.primary}15`,
        }}
      >
        📐 A = P(1 + r/n)<sup>nt</sup> · İllik 8% mürəkkəb faiz
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          height: 150,
          marginBottom: 12,
        }}
      >
        {years.map((y, i) => (
          <div
            key={y}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontFamily: MONO,
                color: tc.future,
                fontWeight: 700,
              }}
            >
              {vals[i] >= 1000 ? `${(vals[i] / 1000).toFixed(1)}K` : vals[i]}
            </span>
            <div
              style={{
                width: "100%",
                borderRadius: 4,
                height: `${Math.max(8, (vals[i] / maxV) * 100)}%`,
                background: `linear-gradient(180deg, ${tc.future}, ${tc.future}88)`,
                transition: "height .5s ease",
              }}
            />
            <span style={{ fontSize: 11, color: T.text3 }}>{y} il</span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          marginTop: 16,
        }}
      >
        {[
          { l: "1 ildə", v: vals[0], c: T.text2 },
          { l: "5 ildə", v: vals[3], c: T.primary },
          { l: "10 ildə", v: vals[5], c: tc.future },
        ].map((s) => (
          <div
            key={s.l}
            style={{
              textAlign: "center",
              padding: "12px",
              background: T.hoverBg,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              transition: "all .4s ease",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: T.text3,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 4,
              }}
            >
              {s.l}
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 16,
                fontWeight: 700,
                color: s.c,
              }}
            >
              {s.v >= 1000 ? `${(s.v / 1000).toFixed(1)}K` : s.v} ₼
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ Goals List ═══ */
export function GoalsList({
  T,
  tc,
  goals,
  simMonthly,
  onRemove,
  onDeposit,
}: {
  T: Theme;
  tc: TypeColors;
  goals: FinancialGoal[];
  simMonthly: number;
  onRemove: (id: number) => void;
  onDeposit: (id: number, amount: number) => void;
}) {
  const { calcMonths, formatTime } = goalCalc(simMonthly);

  return (
    <>
      <div
        style={{
          fontSize: 11,
          color: T.text3,
          marginBottom: 14,
          padding: "8px 12px",
          background: `${tc.future}08`,
          borderRadius: 8,
          border: `1px solid ${tc.future}15`,
        }}
      >
        Hesablama: aylıq{" "}
        <strong style={{ color: tc.future }}>{simMonthly} ₼</strong> + 8% illik
        mürəkkəb faiz
      </div>
      {goals.map((g) => {
        const pct = Math.round((g.saved / g.target) * 100);
        const remaining = g.target - g.saved;
        const months = calcMonths(remaining);
        return (
          <div
            key={g.id}
            style={{ padding: "16px 0", borderBottom: `1px solid ${T.border}` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                {g.emoji} {g.name}
              </span>
              <button
                onClick={() => onRemove(g.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  color: T.text3,
                }}
              >
                ✕
              </button>
            </div>
            <Progress
              value={g.saved}
              max={g.target}
              color={tc.future}
              height={7}
              T={T}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
                fontSize: 12,
              }}
            >
              <span style={{ fontFamily: MONO, color: T.text2 }}>
                {g.saved.toLocaleString()} / {g.target.toLocaleString()} ₼
              </span>
              <span
                style={{ fontFamily: MONO, fontWeight: 700, color: tc.future }}
              >
                {pct}%
              </span>
            </div>
            <div
              style={{
                marginTop: 8,
                padding: "8px 12px",
                borderRadius: 8,
                background: `${T.primary}06`,
                border: `1px solid ${T.primary}12`,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 11, color: T.text2 }}>
                ⏱ Qalıq: {remaining.toLocaleString()} ₼
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.primary,
                  fontFamily: MONO,
                }}
              >
                {formatTime(months)}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {[50, 100, 200].map((a) => (
                <button
                  key={a}
                  onClick={() => onDeposit(g.id, a)}
                  style={{
                    flex: 1,
                    padding: "6px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    background: T.hoverBg,
                    border: `1px solid ${T.border}`,
                    color: tc.future,
                    fontFamily: FONT,
                    transition: "all .2s ease",
                  }}
                >
                  +{a}₼
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {goals.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "30px 0",
            color: T.text3,
            fontSize: 13,
          }}
        >
          Hədəf əlavə edin →
        </div>
      )}
    </>
  );
}

/* ═══ Add Goal Form ═══ */
export function AddGoalForm({
  T,
  onAdd,
}: {
  T: Theme;
  onAdd: (name: string, target: number, emoji: string) => void;
}) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    fontSize: 13,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    color: T.text1,
    outline: "none",
    fontFamily: FONT,
    background: T.inputBg,
    transition: "all .4s ease",
  };

  const handleAdd = () => {
    if (!name || !target) return;
    onAdd(name, Number(target), emoji);
    setName("");
    setTarget("");
    setEmoji("🎯");
  };

  return (
    <Card title="Yeni Hədəf Əlavə Et" T={T}>
      <div
        style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}
      >
        {GOAL_EMOJIS.map((em) => (
          <button
            key={em}
            onClick={() => setEmoji(em)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: emoji === em ? T.activeBg : T.hoverBg,
              border:
                emoji === em
                  ? `2px solid ${T.primary}`
                  : `1px solid ${T.border}`,
              transition: "all .2s ease",
            }}
          >
            {em}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hədəf adı"
          style={{ ...inputStyle, flex: 1 }}
        />
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Məbləğ ₼"
          style={{
            ...inputStyle,
            width: 130,
            fontFamily: MONO,
            textAlign: "right",
          }}
        />
        <Btn primary onClick={handleAdd} disabled={!name || !target} T={T}>
          Əlavə et
        </Btn>
      </div>
    </Card>
  );
}
