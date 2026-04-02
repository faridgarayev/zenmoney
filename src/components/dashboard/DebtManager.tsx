import { useState, useEffect } from "react";
import {
  type Theme,
  type TypeColors,
  type Debt,
  type ImpulseItem,
} from "../../models";
import { Card, Btn, Badge, Progress, Fact } from "../ui/ThemedComponents";
import { MONO } from "../../constants/styles";

const DEBT_COLS = "90px 1fr 1fr 80px 110px 80px 70px";

/* ═══ Debt Table ═══ */
export function DebtTable({
  T,
  tc,
  debts,
  onPay,
  onAddNew,
}: {
  T: Theme;
  tc: TypeColors;
  debts: Debt[];
  onPay: (id: number) => void;
  onAddNew: () => void;
}) {
  const headerCell: React.CSSProperties = {
    padding: "10px 12px",
    fontSize: 11,
    fontWeight: 600,
    color: T.text3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    whiteSpace: "nowrap",
    borderBottom: `2px solid ${T.border}`,
    background: T.tableBg,
  };
  const cell: React.CSSProperties = {
    padding: "11px 12px",
    fontSize: 13,
    color: T.text1,
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <Card
      title="Borc Qeydləri"
      actions={
        <Btn primary small onClick={onAddNew} T={T}>
          + Yeni borc
        </Btn>
      }
      T={T}
    >
      {debts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px 0",
            color: T.text3,
            fontSize: 13,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          Heç bir borc yoxdur
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: DEBT_COLS }}>
            <div style={headerCell}>Tarix</div>
            <div style={headerCell}>Ad</div>
            <div style={headerCell}>Qeyd</div>
            <div style={headerCell}>Növ</div>
            <div style={{ ...headerCell, textAlign: "right" }}>Məbləğ</div>
            <div style={headerCell}>Status</div>
            <div style={{ ...headerCell, textAlign: "center" }}></div>
          </div>

          {/* Rows */}
          {debts.map((d) => (
            <div
              key={d.id}
              style={{
                display: "grid",
                gridTemplateColumns: DEBT_COLS,
                opacity: d.paid ? 0.45 : 1,
                transition: "all .3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = T.tableHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div
                style={{
                  ...cell,
                  fontFamily: MONO,
                  fontSize: 11,
                  color: T.text3,
                }}
              >
                {d.date}
              </div>
              <div style={{ ...cell, fontWeight: 600 }}>{d.name}</div>
              <div style={{ ...cell, color: T.text2, fontSize: 12 }}>
                {d.note}
              </div>
              <div style={cell}>
                <Badge color={d.type === "lent" ? T.danger : tc.future} T={T}>
                  {d.type === "lent" ? "Verdim" : "Aldım"}
                </Badge>
              </div>
              <div
                style={{
                  ...cell,
                  textAlign: "right",
                  fontFamily: MONO,
                  fontWeight: 600,
                  color: d.type === "lent" ? T.danger : tc.future,
                  textDecoration: d.paid ? "line-through" : "none",
                }}
              >
                {d.amount.toFixed(2)} ₼
              </div>
              <div style={cell}>
                {d.paid ? (
                  <Badge color={tc.future} T={T}>
                    Ödənib
                  </Badge>
                ) : (
                  <Badge color={T.warning} T={T}>
                    Açıq
                  </Badge>
                )}
              </div>
              <div style={{ ...cell, textAlign: "center" }}>
                {!d.paid && (
                  <Btn small onClick={() => onPay(d.id)} T={T}>
                    ✓
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </Card>
  );
}

/* ═══ Debt Summary Sidebar ═══ */
export function DebtSummary({
  T,
  tc,
  totalOut,
  totalIn,
}: {
  T: Theme;
  tc: TypeColors;
  totalOut: number;
  totalIn: number;
}) {
  return (
    <Card title="Borc Xülasəsi" T={T}>
      <Fact
        label="Verdiyim"
        value={`${totalOut.toFixed(2)} ₼`}
        color={T.danger}
        sub="Geri gələcək"
        T={T}
      />
      <Fact
        label="Aldığım"
        value={`${totalIn.toFixed(2)} ₼`}
        color={tc.future}
        sub="Qaytarmalıyam"
        T={T}
      />
      <Fact
        label="Net balans"
        value={`${(totalOut - totalIn).toFixed(2)} ₼`}
        color={totalOut > totalIn ? T.danger : tc.future}
        T={T}
      />
    </Card>
  );
}

/* ═══ Impulse Timer ═══ */
export function ImpTimer({
  item,
  onCancel,
  onConfirm,
  T,
}: {
  item: ImpulseItem;
  onCancel: () => void;
  onConfirm: () => void;
  T: Theme;
}) {
  const [secs, setSecs] = useState(item.remainingSecs);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600),
    m = Math.floor((secs % 3600) / 60),
    s = secs % 60;
  const pct = ((86400 - secs) / 86400) * 100;

  return (
    <div
      style={{
        padding: "16px 18px",
        borderRadius: 10,
        background: `${T.warning}08`,
        border: `1px solid ${T.warning}25`,
        marginBottom: 12,
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
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.text1 }}>
            🧊 {item.name}
          </span>
          <span style={{ fontSize: 12, color: T.text2, marginLeft: 10 }}>
            {item.amount} ₼
          </span>
        </div>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 14,
            fontWeight: 700,
            color: T.danger,
          }}
        >
          {h.toString().padStart(2, "0")}:{m.toString().padStart(2, "0")}:
          {s.toString().padStart(2, "0")}
        </span>
      </div>
      <Progress value={pct} max={100} color={T.warning} T={T} height={4} />
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <Btn small onClick={onCancel} primary T={T}>
          Ləğv et — Yığıma at
        </Btn>
        <Btn small onClick={onConfirm} T={T}>
          Hələ də istəyirəm
        </Btn>
      </div>
    </div>
  );
}
