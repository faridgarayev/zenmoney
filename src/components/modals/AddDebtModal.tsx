import { useState } from "react";
import { type Theme, type TypeColors } from "../../models";
import { FONT, MONO } from "../../constants/styles";
import { Btn } from "../ui/ThemedComponents";
import { ModalWrap, ModalHeader, getInputStyle } from "../ui/ModalShell";

interface Props {
  T: Theme;
  tc: TypeColors;
  onClose: () => void;
  onAdd: (
    name: string,
    amount: number,
    type: "lent" | "borrowed",
    note: string,
  ) => void;
}

export function AddDebtModal({ T, tc, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"lent" | "borrowed">("lent");
  const [note, setNote] = useState("");

  const inputStyle = getInputStyle(T);

  const typeOptions = [
    { t: "lent" as const, label: "📤 Verdim", color: T.danger },
    { t: "borrowed" as const, label: "📥 Aldım", color: tc.future },
  ];

  return (
    <ModalWrap T={T} onClose={onClose}>
      <ModalHeader T={T} title="Yeni Borc" onClose={onClose} />
      <div style={{ padding: "24px" }}>
        {/* ── Name ── */}
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.text2,
              display: "block",
              marginBottom: 6,
            }}
          >
            Ad *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kimin adı?"
            style={inputStyle}
          />
        </div>

        {/* ── Amount ── */}
        <div style={{ marginBottom: 14 }}>
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
            style={{ ...inputStyle, fontFamily: MONO, fontWeight: 700 }}
          />
        </div>

        {/* ── Type Toggle ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {typeOptions.map((opt) => (
            <button
              key={opt.t}
              onClick={() => setType(opt.t)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT,
                background: type === opt.t ? `${opt.color}12` : T.hoverBg,
                border:
                  type === opt.t
                    ? `2px solid ${opt.color}`
                    : `1px solid ${T.border}`,
                color: type === opt.t ? opt.color : T.text2,
                transition: "all .2s ease",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* ── Note ── */}
        <div style={{ marginBottom: 8 }}>
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
            placeholder={
              type === "lent" ? "Boş → 'Borc verdim'" : "Boş → 'Borc aldım'"
            }
            style={inputStyle}
          />
        </div>
        <div style={{ fontSize: 11, color: T.text3, marginBottom: 20 }}>
          💡 Boş buraxılsa avtomatik qeyd yazılacaq
        </div>

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn onClick={onClose} T={T}>
            Ləğv et
          </Btn>
          <Btn
            primary
            onClick={() => {
              onAdd(name, Number(amount), type, note);
              onClose();
            }}
            disabled={!name || !amount}
            T={T}
          >
            Əlavə et
          </Btn>
        </div>
      </div>
    </ModalWrap>
  );
}
