import { useState, useEffect } from "react";
import { type IOnboardingResult, type Theme, type TypeColors } from "../../models";
import { Btn } from "../ui/ThemedComponents";
import { Confetti } from "../ui/ThemedComponents";
import { AppHeader } from "../layout/AppHeader";
import { typeColorsFor, MONO, FONT } from "../../constants/styles";
import { themes } from "../../constants/themes";
import { getCurrentMonthLabel } from "../../utils/getMonths";
import { STEPS } from "../../constants/steps";
import { AVATARS } from "../../constants/avatars";
import { EXPENSE_PRESETS } from "../../constants/expensePresets";

interface Props {
  onComplete: (result: IOnboardingResult) => void;
  dark: boolean;
  setDark: (fn: (d: boolean) => boolean) => void;
}

/* ═══════════════════════════════════════════════════════════
   Onboarding Wizard — Themed Edition
   ═══════════════════════════════════════════════════════════ */
export default function OnboardingWizard({ onComplete, dark, setDark }: Props) {
  const T: Theme = dark ? themes.dark : themes.light;
  const tc: TypeColors = typeColorsFor(dark ? "dark" : "light");

  const [step, setStep] = useState(0);
  const [salary, setSalary] = useState("");
  const [expenses, setExpenses] = useState<Record<string, boolean>>({});
  const [expenseAmounts, setExpenseAmounts] = useState<Record<string, string>>(
    {},
  );
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [split, setSplit] = useState({ need: 50, want: 30, future: 20 });
  const [animKey, setAnimKey] = useState(0);
  const [shake, setShake] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!document.getElementById("zm-onboarding-css")) {
      const s = document.createElement("style");
      s.id = "zm-onboarding-css";
      s.textContent = `
        @keyframes zmSlideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes zmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes zmShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
        @keyframes zmGlow{0%,100%{box-shadow:0 0 20px rgba(88,166,255,.15)}50%{box-shadow:0 0 40px rgba(88,166,255,.3)}}
      `;
      document.head.appendChild(s);
    }
  }, []);

  const go = (to: number) => {
    setStep(to);
    setAnimKey((k) => k + 1);
  };
  const next = () => {
    if (step === 1 && (!salary || Number(salary) <= 0)) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    if (step < STEPS.length - 1) go(step + 1);
    if (step === STEPS.length - 2) setShowConfetti(true);
  };
  const prev = () => {
    if (step > 0) go(step - 1);
  };

  const salaryNum = Number(salary) || 0;
  const totalExp = Object.entries(expenseAmounts).reduce(
    (s, [k, v]) => s + (expenses[k] ? Number(v) || 0 : 0),
    0,
  );
  const needAmt = Math.round((salaryNum * split.need) / 100);
  const wantAmt = Math.round((salaryNum * split.want) / 100);
  const futureAmt = salaryNum - needAmt - wantAmt;

  const adjustSplit = (key: string, val: number) => {
    val = Math.max(0, Math.min(100, val));
    const others = ["need", "want", "future"].filter((k) => k !== key);
    const remaining = 100 - val;
    const oldSum = (split as any)[others[0]] + (split as any)[others[1]];
    const ns = { ...split, [key]: val } as any;
    if (oldSum === 0) {
      ns[others[0]] = Math.round(remaining / 2);
      ns[others[1]] = remaining - ns[others[0]];
    } else {
      ns[others[0]] = Math.round(
        ((split as any)[others[0]] / oldSum) * remaining,
      );
      ns[others[1]] = remaining - ns[others[0]];
    }
    setSplit(ns);
  };

  const canNext = () => {
    if (step === 1) return salary && Number(salary) > 0;
    if (step === 3) return !!selectedAvatar;
    return true;
  };

  const handleComplete = () => {
    const av = AVATARS.find((a) => a.id === selectedAvatar) || AVATARS[0];
    const expList = Object.entries(expenseAmounts)
      .filter(([k]) => expenses[k])
      .map(([k, v]) => ({ id: k, amount: Number(v) || 0 }));
    onComplete({
      salary: salaryNum,
      avatar: { id: av.id, emoji: av.emoji, name: av.name },
      split,
      expenses: expList,
    });
  };

  // Shared styles
  const slideIn: React.CSSProperties = {
    animation: "zmSlideIn .5s cubic-bezier(.4,0,.2,1) both",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    fontSize: 20,
    fontWeight: 700,
    background: T.inputBg,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    color: T.text1,
    outline: "none",
    textAlign: "center",
    fontFamily: MONO,
    transition: "border .3s ease",
    ...(shake ? { animation: "zmShake .5s ease" } : {}),
  };

  /* ═══════════ STEP RENDERS ═══════════ */

  const renderWelcome = () => (
    <div key={animKey} style={slideIn}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            fontSize: 64,
            display: "inline-block",
            animation: "zmFloat 3s ease-in-out infinite",
          }}
        >
          💰
        </div>
      </div>
      <h2
        style={{
          fontSize: 26,
          fontWeight: 800,
          textAlign: "center",
          color: T.text1,
          marginBottom: 8,
          letterSpacing: -0.5,
        }}
      >
        Maliyyə portretini çəkək
      </h2>
      <p
        style={{
          fontSize: 14,
          textAlign: "center",
          color: T.text3,
          marginBottom: 28,
          lineHeight: 1.6,
        }}
      >
        2 dəqiqədə sənin üçün fərdi maliyyə planı hazırlayacağıq.
      </p>
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {["🎯 Fərdi plan", "🧠 Ağıllı bölgü", "🎮 Oyun elementi"].map(
          (t, i) => (
            <span
              key={i}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                fontSize: 13,
                background: `${T.primary}12`,
                border: `1px solid ${T.primary}25`,
                color: T.primary,
                animation: `zmSlideIn .5s cubic-bezier(.4,0,.2,1) ${i * 0.1}s both`,
              }}
            >
              {t}
            </span>
          ),
        )}
      </div>
    </div>
  );

  const renderSalary = () => (
    <div key={animKey} style={slideIn}>
      <div style={{ textAlign: "center", fontSize: 40, marginBottom: 12 }}>
        💼
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          textAlign: "center",
          color: T.text1,
          marginBottom: 6,
        }}
      >
        Aylıq gəlirin nə qədərdir?
      </h2>
      <p
        style={{
          fontSize: 13,
          textAlign: "center",
          color: T.text3,
          marginBottom: 24,
        }}
      >
        Maaş, freelance, əlavə gəlir — hamısını daxil et
      </p>
      <div style={{ position: "relative" }}>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="0"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = T.primary)}
          onBlur={(e) => (e.target.style.borderColor = T.border)}
        />
        <span
          style={{
            position: "absolute",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 16,
            fontWeight: 700,
            color: T.text3,
            fontFamily: MONO,
          }}
        >
          ₼
        </span>
      </div>
      {salaryNum > 0 && (
        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            borderRadius: 10,
            background: `${tc.future}10`,
            border: `1px solid ${tc.future}20`,
            fontSize: 13,
            color: tc.future,
            textAlign: "center",
            animation: "zmSlideIn .4s ease both",
          }}
        >
          ✨ Gündəlik büdcən təxminən{" "}
          <strong>{Math.round(salaryNum / 30)} ₼</strong> olacaq
        </div>
      )}
    </div>
  );

  const renderExpenses = () => (
    <div key={animKey} style={slideIn}>
      <div style={{ textAlign: "center", fontSize: 40, marginBottom: 12 }}>
        📋
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          textAlign: "center",
          color: T.text1,
          marginBottom: 6,
        }}
      >
        Sabit xərclərin
      </h2>
      <p
        style={{
          fontSize: 13,
          textAlign: "center",
          color: T.text3,
          marginBottom: 20,
        }}
      >
        Seç və məbləği daxil et
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxHeight: 320,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {EXPENSE_PRESETS.map((ex, i) => {
          const active = !!expenses[ex.id];
          return (
            <div
              key={ex.id}
              onClick={() => setExpenses((p) => ({ ...p, [ex.id]: !p[ex.id] }))}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 12,
                cursor: "pointer",
                background: active ? `${T.primary}10` : T.cardBg,
                border: `1px solid ${active ? `${T.primary}30` : T.border}`,
                transition: "all .3s ease",
                animation: `zmSlideIn .4s ease ${i * 0.03}s both`,
              }}
            >
              <span style={{ fontSize: 20 }}>{ex.emoji}</span>
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 500,
                  color: T.text1,
                }}
              >
                {ex.label}
              </span>
              {active && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="number"
                    value={expenseAmounts[ex.id] || ""}
                    onChange={(e) =>
                      setExpenseAmounts((p) => ({
                        ...p,
                        [ex.id]: e.target.value,
                      }))
                    }
                    placeholder="0"
                    style={{
                      width: 80,
                      padding: "6px 10px",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: MONO,
                      background: T.bg,
                      border: `1px solid ${T.primary}30`,
                      borderRadius: 8,
                      color: T.text1,
                      textAlign: "right",
                      outline: "none",
                    }}
                  />
                  <span
                    style={{ fontSize: 11, color: T.text3, fontWeight: 600 }}
                  >
                    ₼
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {totalExp > 0 && (
        <div
          style={{
            marginTop: 12,
            textAlign: "center",
            fontSize: 13,
            color: totalExp > salaryNum * 0.7 ? T.danger : tc.future,
          }}
        >
          Sabit xərclər: <strong>{totalExp} ₼</strong> (
          {salaryNum > 0 ? Math.round((totalExp / salaryNum) * 100) : 0}%)
        </div>
      )}
    </div>
  );

  const renderAvatar = () => (
    <div key={animKey} style={slideIn}>
      <div style={{ textAlign: "center", fontSize: 40, marginBottom: 12 }}>
        🎭
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          textAlign: "center",
          color: T.text1,
          marginBottom: 6,
        }}
      >
        Maliyyə Avatarını seç
      </h2>
      <p
        style={{
          fontSize: 13,
          textAlign: "center",
          color: T.text3,
          marginBottom: 20,
        }}
      >
        Bu avatar səninlə birlikdə böyüyəcək
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {AVATARS.map((av, i) => {
          const sel = selectedAvatar === av.id;
          return (
            <div
              key={av.id}
              onClick={() => setSelectedAvatar(av.id)}
              style={{
                padding: "20px 16px",
                borderRadius: 14,
                cursor: "pointer",
                textAlign: "center",
                background: sel ? `${T.primary}10` : T.cardBg,
                border: `2px solid ${sel ? T.primary : T.border}`,
                transition: "all .3s ease",
                transform: sel ? "scale(1.03)" : "scale(1)",
                animation: `zmSlideIn .5s ease ${i * 0.08}s both`,
                ...(sel ? { boxShadow: `0 0 24px ${T.primary}15` } : {}),
              }}
            >
              <div
                style={{
                  fontSize: 44,
                  marginBottom: 8,
                  animation: sel ? "zmFloat 2s ease-in-out infinite" : "none",
                }}
              >
                {av.emoji}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: sel ? T.primary : T.text1,
                  marginBottom: 4,
                }}
              >
                {av.name}
              </div>
              <div style={{ fontSize: 12, color: T.text3 }}>{av.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSplit = () => {
    const items = [
      {
        key: "need",
        label: "Zərurət",
        emoji: "🏠",
        color: tc.need,
        desc: "Kirayə, yemək, kommunal",
      },
      {
        key: "want",
        label: "İstəklər",
        emoji: "✨",
        color: tc.want,
        desc: "Kafe, əyləncə, alış-veriş",
      },
      {
        key: "future",
        label: "Gələcək",
        emoji: "🚀",
        color: tc.future,
        desc: "Yığım, investisiya",
      },
    ];
    return (
      <div key={animKey} style={slideIn}>
        <div style={{ textAlign: "center", fontSize: 40, marginBottom: 12 }}>
          ⚖️
        </div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            textAlign: "center",
            color: T.text1,
            marginBottom: 6,
          }}
        >
          50 / 30 / 20 Bölgü
        </h2>
        <p
          style={{
            fontSize: 13,
            textAlign: "center",
            color: T.text3,
            marginBottom: 24,
          }}
        >
          Sürüşdür və uyğunlaşdır
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {items.map((it, i) => (
            <div
              key={it.key}
              style={{ animation: `zmSlideIn .4s ease ${i * 0.1}s both` }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{it.emoji}</span>
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: T.text1 }}
                  >
                    {it.label}
                  </span>
                  <span style={{ fontSize: 11, color: T.text3 }}>
                    {it.desc}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: it.color,
                    fontFamily: MONO,
                    minWidth: 55,
                    textAlign: "right",
                  }}
                >
                  {(split as any)[it.key]}%
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                value={(split as any)[it.key]}
                onChange={(e) => adjustSplit(it.key, Number(e.target.value))}
                style={{ width: "100%", accentColor: it.color }}
              />
              {salaryNum > 0 && (
                <div
                  style={{
                    fontSize: 12,
                    color: T.text3,
                    marginTop: 4,
                    textAlign: "right",
                  }}
                >
                  ≈ {Math.round((salaryNum * (split as any)[it.key]) / 100)} ₼ /
                  ay
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Visual bar */}
        <div
          style={{
            marginTop: 22,
            height: 7,
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            background: T.border,
          }}
        >
          <div
            style={{
              width: `${split.need}%`,
              background: tc.need,
              transition: "width .3s ease",
            }}
          />
          <div
            style={{
              width: `${split.want}%`,
              background: tc.want,
              transition: "width .3s ease",
            }}
          />
          <div
            style={{
              width: `${split.future}%`,
              background: tc.future,
              transition: "width .3s ease",
            }}
          />
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    const av = AVATARS.find((a) => a.id === selectedAvatar) || AVATARS[0];
    return (
      <div key={animKey} style={slideIn}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              fontSize: 72,
              display: "inline-block",
              animation: "zmFloat 2.5s ease-in-out infinite",
            }}
          >
            {av.emoji}
          </div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: T.text1,
              marginTop: 8,
            }}
          >
            Tanış ol: {av.name}!
          </h2>
          <p style={{ fontSize: 13, color: T.text3, marginTop: 4 }}>
            Sənin maliyyə yoldaşın hazırdır
          </p>
        </div>
        <div
          style={{
            background: T.cardBg,
            borderRadius: 14,
            padding: "20px",
            border: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
          >
            {[
              { label: "Aylıq gəlir", value: `${salaryNum} ₼`, color: T.text1 },
              {
                label: "Sabit xərclər",
                value: `${totalExp} ₼`,
                color: T.danger,
              },
              {
                label: "Zərurət",
                value: `${needAmt} ₼ (${split.need}%)`,
                color: tc.need,
              },
              {
                label: "İstəklər",
                value: `${wantAmt} ₼ (${split.want}%)`,
                color: tc.want,
              },
              {
                label: "Gələcək",
                value: `${futureAmt} ₼ (${split.future}%)`,
                color: tc.future,
              },
              {
                label: "Gündəlik limit",
                value: `${Math.round((needAmt + wantAmt) / 30)} ₼`,
                color: T.primary,
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{ animation: `zmSlideIn .4s ease ${i * 0.08}s both` }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: T.text3,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: item.color,
                    fontFamily: MONO,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            borderRadius: 10,
            background: `${T.primary}08`,
            border: `1px solid ${T.primary}15`,
            fontSize: 13,
            color: T.primary,
            textAlign: "center",
            animation: "zmSlideIn .5s ease .5s both",
          }}
        >
          🎮 Streak sistemi aktivdir — hər gün büdcə daxilində qal, badge qazan!
        </div>
      </div>
    );
  };

  const stepRenderers = [
    renderWelcome,
    renderSalary,
    renderExpenses,
    renderAvatar,
    renderSplit,
    renderSummary,
  ];

  /* ═══════════ LAYOUT ═══════════ */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: FONT,
        color: T.text1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />

      {/* ═══ Header — same as Dashboard ═══ */}
      <AppHeader
        T={T}
        dark={dark}
        setDark={setDark}
        extraIncome={0}
        month={getCurrentMonthLabel()}
        streak={0}
        avatarEmoji="💰"
      />

      {/* ═══ Content Area ═══ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
        }}
      >
        {/* Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 540,
            background: T.cardBg,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: "36px 32px 28px",
            boxShadow: T.shadowLg,
          }}
        >
          {/* Progress Dots */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                style={{
                  width: i === step ? 32 : 10,
                  height: 10,
                  borderRadius: 5,
                  background:
                    i === step ? T.primary : i < step ? T.primary : T.border,
                  opacity: i === step ? 1 : i < step ? 0.5 : 0.3,
                  transition: "all .4s ease",
                }}
              />
            ))}
          </div>

          {/* Step Content */}
          {stepRenderers[step]()}

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 28,
              gap: 12,
            }}
          >
            {step > 0 ? (
              <Btn onClick={prev} T={T}>
                ← Geri
              </Btn>
            ) : (
              <div />
            )}
            <button
              onClick={step === STEPS.length - 1 ? handleComplete : next}
              disabled={!canNext()}
              style={{
                padding: "12px 32px",
                borderRadius: 10,
                border: "none",
                cursor: canNext() ? "pointer" : "default",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: FONT,
                letterSpacing: 0.2,
                background: T.primary,
                color: "#fff",
                opacity: canNext() ? 1 : 0.35,
                transition: "all .3s ease",
                ...(step === STEPS.length - 1
                  ? { animation: "zmGlow 2s ease-in-out infinite" }
                  : {}),
              }}
            >
              {step === 0
                ? "Başlayaq! 🚀"
                : step === STEPS.length - 1
                  ? "Dashboard-a keç ✨"
                  : "Davam et →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
