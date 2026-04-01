import { useState, useEffect } from "react";
import {
  type Theme,
  type TypeColors,
  type Debt,
  type ImpulseItem,
} from "../../types/finance";
import { Card, Btn, Badge, Progress, Fact } from "../ui/ThemedComponents";
import { MONO } from "../../constants/styles";

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
  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "10px 14px",
    fontSize: 11,
    fontWeight: 600,
    color: T.text3,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    borderBottom: `2px solid ${T.border}`,
    background: T.tableBg,
    transition: "all .4s ease",
  };
  const tdStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: 13,
    borderBottom: `1px solid ${T.border}`,
    color: T.text1,
    transition: "all .4s ease",
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
        <div style={{ textAlign: "center", padding: "50px 0", color: T.text3 }}>
          Heç bir borc yoxdur
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={thStyle}>Tarix</th>
              <th style={thStyle}>Ad</th>
              <th style={thStyle}>Qeyd</th>
              <th style={thStyle}>Növ</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Məbləğ</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {debts.map((d) => (
              <tr
                key={d.id}
                style={{
                  opacity: d.paid ? 0.45 : 1,
                  transition: "opacity .4s ease",
                }}
              >
                <td
                  style={{
                    ...tdStyle,
                    fontFamily: MONO,
                    fontSize: 12,
                    color: T.text3,
                  }}
                >
                  {d.date}
                </td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{d.name}</td>
                <td style={{ ...tdStyle, color: T.text2 }}>{d.note}</td>
                <td style={tdStyle}>
                  <Badge color={d.type === "lent" ? T.danger : tc.future} T={T}>
                    {d.type === "lent" ? "Verdim" : "Aldım"}
                  </Badge>
                </td>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: "right",
                    fontFamily: MONO,
                    fontWeight: 600,
                    color: d.type === "lent" ? T.danger : tc.future,
                    textDecoration: d.paid ? "line-through" : "none",
                  }}
                >
                  {d.amount.toFixed(2)} ₼
                </td>
                <td style={tdStyle}>
                  {d.paid ? (
                    <Badge color={tc.future} T={T}>
                      Ödənib
                    </Badge>
                  ) : (
                    <Badge color={T.warning} T={T}>
                      Açıq
                    </Badge>
                  )}
                </td>
                <td style={tdStyle}>
                  {!d.paid && (
                    <Btn small onClick={() => onPay(d.id)} T={T}>
                      ✓ Ödəndi
                    </Btn>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
