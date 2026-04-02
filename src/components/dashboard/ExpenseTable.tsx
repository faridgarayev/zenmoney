import { MOODS } from "../../constants/mood";
import { MONO, typeLabels } from "../../constants/styles";
import {
  type Theme,
  type TypeColors,
  type Expense,
  type Category,
} from "../../models";
import { Card, Btn, Badge } from "../ui/ThemedComponents";

interface Props {
  T: Theme;
  tc: TypeColors;
  expenses: Expense[];
  categories: Category[];
  recurringExpenses: Expense[];
  recurringTotal: number;
  onAdd: () => void;
  onToggleRecurring: (id: number) => void;
}

const COLS = "90px 1fr 1fr 50px 110px 80px 44px";

export function ExpenseTable({
  T,
  tc,
  expenses,
  categories,
  recurringExpenses,
  recurringTotal,
  onAdd,
  onToggleRecurring,
}: Props) {
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
    padding: "11px 0px",
    fontSize: 13,
    color: T.text1,
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <Card
      title="Xərc Qeydləri"
      actions={
        <Btn primary small onClick={onAdd} T={T}>
          + Yeni
        </Btn>
      }
      T={T}
    >
      {/* Header */}
      <div
        style={{ display: "grid", gridTemplateColumns: COLS, minWidth: 560 }}
      >
        <div style={headerCell}>Tarix</div>
        <div style={headerCell}>Kateqoriya</div>
        <div style={headerCell}>Açıqlama</div>
        <div style={{ ...headerCell, textAlign: "center" }}>Əhval</div>
        <div style={{ ...headerCell, textAlign: "right" }}>Məbləğ</div>
        <div style={headerCell}>Növ</div>
        <div style={{ ...headerCell, textAlign: "center" }}>🔄</div>
      </div>

      {/* Rows */}
      {[...expenses].reverse().map((ex) => {
        const cat = categories.find((c) => c.id === ex.category);
        const mood = MOODS.find((m) => m.key === ex.mood);
        const isFuture = cat?.type === "future";
        const isNeed = cat?.type === "need";
        return (
          <div
            key={ex.id}
            style={{
              display: "grid",
              gridTemplateColumns: COLS,
              minWidth: 560,
              transition: "background .2s",
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
              {ex.date}
            </div>
            <div style={{ ...cell, fontSize: 12 }}>
              <span style={{ marginRight: 4 }}>{cat?.emoji}</span>
              {cat?.label}
            </div>
            <div style={{ ...cell, color: T.text2, fontSize: 12 }}>
              {ex.note}
            </div>
            <div style={{ ...cell, fontSize: 16, textAlign: "center" }}>
              {mood?.emoji}
            </div>
            <div
              style={{
                ...cell,
                textAlign: "right",
                fontFamily: MONO,
                fontWeight: 600,
                color: isFuture ? tc.future : T.text1,
              }}
            >
              {isFuture ? "+" : "-"}
              {ex.amount.toFixed(2)} ₼
            </div>
            <div style={cell}>
              <Badge color={tc[cat?.type as keyof TypeColors]} T={T}>
                {typeLabels[cat?.type || ""]}
              </Badge>
            </div>
            <div style={{ ...cell, textAlign: "center" }}>
              {isNeed && (
                <button
                  onClick={() => onToggleRecurring(ex.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    opacity: ex.recurring ? 1 : 0.2,
                  }}
                >
                  {ex.recurring ? "🔁" : "🔄"}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {expenses.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "32px 0",
            color: T.text3,
            fontSize: 13,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
          Hələ xərc yoxdur — "+ Yeni" ilə əlavə et
        </div>
      )}

      {recurringExpenses.length > 0 && (
        <div
          style={{
            marginTop: 14,
            padding: "10px 16px",
            background: `${T.primary}08`,
            borderRadius: 8,
            border: `1px solid ${T.primary}15`,
            fontSize: 12,
            color: T.primary,
          }}
        >
          🔁 <strong>{recurringExpenses.length}</strong> təkrarlanan — aylıq{" "}
          <strong>{recurringTotal.toFixed(2)} ₼</strong>
        </div>
      )}
    </Card>
  );
}
