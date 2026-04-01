import { MOODS } from "../../constants/mood";
import { MONO, typeLabels } from "../../constants/styles";
import {
  type Theme,
  type TypeColors,
  type Expense,
  type Category,
} from "../../types/finance";
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
      title="Xərc Qeydləri"
      actions={
        <Btn primary small onClick={onAdd} T={T}>
          + Yeni
        </Btn>
      }
      T={T}
    >
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th style={thStyle}>Tarix</th>
              <th style={thStyle}>Kateqoriya</th>
              <th style={thStyle}>Açıqlama</th>
              <th style={thStyle}>Əhval</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Məbləğ</th>
              <th style={thStyle}>Növ</th>
              <th style={{ ...thStyle, textAlign: "center" }}>🔄</th>
            </tr>
          </thead>
          <tbody>
            {[...expenses].reverse().map((ex) => {
              const cat = categories.find((c) => c.id === ex.category);
              const mood = MOODS.find((m) => m.key === ex.mood);
              const isFuture = cat?.type === "future";
              const isNeed = cat?.type === "need";
              return (
                <tr
                  key={ex.id}
                  style={{ transition: "background .2s ease" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = T.tableHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    style={{
                      ...tdStyle,
                      fontFamily: MONO,
                      fontSize: 12,
                      color: T.text3,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ex.date}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ marginRight: 6 }}>{cat?.emoji}</span>
                    {cat?.label}
                  </td>
                  <td style={{ ...tdStyle, color: T.text2 }}>{ex.note}</td>
                  <td style={{ ...tdStyle, fontSize: 16 }}>{mood?.emoji}</td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontFamily: MONO,
                      fontWeight: 600,
                      color: isFuture ? tc.future : T.text1,
                    }}
                  >
                    {isFuture ? "+" : "-"}
                    {ex.amount.toFixed(2)} ₼
                  </td>
                  <td style={tdStyle}>
                    <Badge color={tc[cat?.type as keyof TypeColors]} T={T}>
                      {typeLabels[cat?.type || ""]}
                    </Badge>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
