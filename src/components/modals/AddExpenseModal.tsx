import { useState } from "react";
import {
  type Theme,
  type TypeColors,
  type Category,
} from "../../types/finance";
import { FONT, MONO } from "../../constants/styles";
import { MOODS } from "../../constants/mood";
import { EMOJI_PICKER } from "../../constants/emojies";
import { Btn } from "../ui/ThemedComponents";
import { ModalWrap, ModalHeader, getInputStyle } from "../ui/ModalShell";

interface Props {
  T: Theme;
  tc: TypeColors;
  categories: Category[];
  onClose: () => void;
  onAdd: (
    amount: number,
    category: string,
    mood: string,
    note: string,
    recurring: boolean,
  ) => void;
  onAddCategory: (
    label: string,
    emoji: string,
    type: "need" | "want" | "future",
  ) => void;
}

export function AddExpenseModal({
  T,
  tc,
  categories,
  onClose,
  onAdd,
  onAddCategory,
}: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [recurring, setRecurring] = useState(false);

  // New category form
  const [showNewCat, setShowNewCat] = useState(false);
  const [catLabel, setCatLabel] = useState("");
  const [catEmoji, setCatEmoji] = useState("💰");
  const [catType, setCatType] = useState<"need" | "want" | "future">("need");

  const inputStyle = getInputStyle(T);
  const selCat = categories.find((c) => c.id === category);

  const handleAdd = () => {
    onAdd(Number(amount), category, mood, note, recurring);
    onClose();
  };

  const handleAddCat = () => {
    if (!catLabel) return;
    onAddCategory(catLabel, catEmoji, catType);
    setCatLabel("");
    setCatEmoji("💰");
    setShowNewCat(false);
  };

  const categoryGroups = [
    { type: "need" as const, label: "Zəruri", color: tc.need },
    { type: "want" as const, label: "İstəklər", color: tc.want },
    { type: "future" as const, label: "Yığım", color: tc.future },
  ];

  return (
    <ModalWrap T={T} onClose={onClose}>
      <ModalHeader T={T} title="Yeni Xərc" onClose={onClose} />
      <div style={{ padding: "24px" }}>
        {/* ── Amount ── */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.text2,
              display: "block",
              marginBottom: 6,
            }}
          >
            Məbləğ (₼) *
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            style={{
              ...inputStyle,
              fontSize: 22,
              fontFamily: MONO,
              fontWeight: 700,
              textAlign: "center",
            }}
          />
        </div>

        {/* ── Mood ── */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.text2,
              display: "block",
              marginBottom: 8,
            }}
          >
            Əhvalın *
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {MOODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMood(m.key)}
                style={{
                  width: 50,
                  height: 46,
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: mood === m.key ? T.activeBg : T.hoverBg,
                  border:
                    mood === m.key
                      ? `2px solid ${T.primary}`
                      : `1px solid ${T.border}`,
                  transition: "all .2s ease",
                }}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* ── Category ── */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <label style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>
              Kateqoriya *
            </label>
            <button
              onClick={() => setShowNewCat((p) => !p)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                color: T.primary,
                fontWeight: 600,
                fontFamily: FONT,
              }}
            >
              {showNewCat ? "✕ Bağla" : "+ Yeni"}
            </button>
          </div>

          {/* New category inline form */}
          {showNewCat && (
            <div
              style={{
                padding: "14px",
                background: T.hoverBg,
                borderRadius: 10,
                border: `1px solid ${T.border}`,
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <input
                  value={catLabel}
                  onChange={(e) => setCatLabel(e.target.value)}
                  placeholder="Ad"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <select
                  value={catType}
                  onChange={(e) => setCatType(e.target.value as any)}
                  style={{ ...inputStyle, width: 110 }}
                >
                  <option value="need">Zəruri</option>
                  <option value="want">İstəklər</option>
                  <option value="future">Yığım</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  marginBottom: 10,
                }}
              >
                {EMOJI_PICKER.map((em) => (
                  <button
                    key={em}
                    onClick={() => setCatEmoji(em)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: catEmoji === em ? T.activeBg : "transparent",
                      border:
                        catEmoji === em
                          ? `2px solid ${T.primary}`
                          : `1px solid ${T.border}`,
                    }}
                  >
                    {em}
                  </button>
                ))}
              </div>
              <Btn
                small
                primary
                onClick={handleAddCat}
                disabled={!catLabel}
                T={T}
              >
                Əlavə et: {catEmoji} {catLabel || "..."}
              </Btn>
            </div>
          )}

          {/* Category group buttons */}
          {categoryGroups.map((g) => (
            <div key={g.type} style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: g.color,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                {g.label}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {categories
                  .filter((c) => c.type === g.type)
                  .map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontFamily: FONT,
                        background: category === c.id ? T.activeBg : T.hoverBg,
                        border:
                          category === c.id
                            ? `1px solid ${T.primary}`
                            : `1px solid ${T.border}`,
                        color: category === c.id ? T.primary : T.text1,
                        transition: "all .2s ease",
                      }}
                    >
                      <span>{c.emoji}</span>
                      {c.label}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Recurring (only for Need) ── */}
        {selCat?.type === "need" && (
          <div
            style={{
              marginBottom: 20,
              padding: "12px 14px",
              background: `${T.primary}06`,
              borderRadius: 10,
              border: `1px solid ${T.primary}15`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              onClick={() => setRecurring(!recurring)}
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                cursor: "pointer",
                background: recurring ? T.primary : T.inputBg,
                border: `2px solid ${recurring ? T.primary : T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {recurring && "✓"}
            </button>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text1 }}>
                🔁 Aylıq avtomatik təkrarla
              </div>
              <div style={{ fontSize: 11, color: T.text3 }}>
                Hər ayın 1-i əlavə olunacaq
              </div>
            </div>
          </div>
        )}

        {/* ── Note ── */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.text2,
              display: "block",
              marginBottom: 6,
            }}
          >
            Qeyd
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="İstəyə bağlı..."
            style={inputStyle}
          />
        </div>

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn onClick={onClose} T={T}>
            Ləğv et
          </Btn>
          <Btn
            primary
            onClick={handleAdd}
            disabled={!amount || !category || !mood}
            T={T}
          >
            Əlavə et
          </Btn>
        </div>
      </div>
    </ModalWrap>
  );
}
