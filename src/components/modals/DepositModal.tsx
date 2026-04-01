import { useState } from "react";
import { type Theme, type TypeColors } from "../../models";
import { MONO } from "../../constants/styles";
import { Btn } from "../ui/ThemedComponents";
import { ModalWrap, ModalHeader, getInputStyle } from "../ui/ModalShell";

interface Props {
  T: Theme;
  tc: TypeColors;
  onClose: () => void;
  onDeposit: (amount: number, target: string) => void;
}

export function DepositModal({ T, tc, onClose, onDeposit }: Props) {
  const [amount, setAmount] = useState("");
  const [target, setTarget] = useState("balance");

  const inputStyle = getInputStyle(T);

  const options = [
    {
      key: "balance",
      label: "💼 Ümumi balans",
      sub: "50/30/20 üzrə bölünəcək",
      color: T.primary,
    },
    { key: "need", label: "🏠 Zəruri (50%)", color: tc.need },
    { key: "want", label: "✨ İstəklər (30%)", color: tc.want },
    { key: "future", label: "🚀 Yığım (20%)", color: tc.future },
  ];

  return (
    <ModalWrap T={T} onClose={onClose}>
      <ModalHeader T={T} title="💰 Əlavə Gəlir" onClose={onClose} />
      <div style={{ padding: "24px" }}>
        {/* ── Amount ── */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.text2,
              display: "block",
              marginBottom: 6,
            }}
          >
            Məbləğ (₼)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            style={{
              ...inputStyle,
              fontSize: 20,
              fontFamily: MONO,
              fontWeight: 700,
              textAlign: "center",
            }}
          />
        </div>

        {/* ── Target Selection ── */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.text2,
              display: "block",
              marginBottom: 8,
            }}
          >
            Hara yönləndir?
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {options.map((o) => (
              <button
                key={o.key}
                onClick={() => setTarget(o.key)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  textAlign: "left",
                  fontWeight: 600,
                  background: target === o.key ? `${o.color}12` : T.hoverBg,
                  border:
                    target === o.key
                      ? `2px solid ${o.color}`
                      : `1px solid ${T.border}`,
                  color: target === o.key ? o.color : T.text1,
                  transition: "all .2s ease",
                }}
              >
                {o.label}
                {o.sub && (
                  <span
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 400,
                      color: T.text3,
                      marginTop: 2,
                    }}
                  >
                    {o.sub}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn onClick={onClose} T={T}>
            Ləğv et
          </Btn>
          <Btn
            primary
            onClick={() => {
              onDeposit(Number(amount), target);
              onClose();
            }}
            disabled={!amount}
            T={T}
          >
            Əlavə et
          </Btn>
        </div>
      </div>
    </ModalWrap>
  );
}
