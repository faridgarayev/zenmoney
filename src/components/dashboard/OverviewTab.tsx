import { FONT, MONO } from "../../constants/styles";
import {
  type Theme,
  type TypeColors,
  type Expense,
  type Debt,
  type Category,
} from "../../models";
import { Card, Fact } from "../ui/ThemedComponents";
import { BudgetSummary } from "./BudgetSummary";
import { ExpenseTable } from "./ExpenseTable";

interface Props {
  T: Theme;
  tc: TypeColors;
  f: {
    spent: { need: number; want: number; future: number };
    needBudget: number;
    wantBudget: number;
    futureBudget: number;
    totalSpent: number;
    totalIncome: number;
    dailyLeft: number;
    extraIncome: number;
    expenses: Expense[];
    categories: Category[];
    recurringExpenses: Expense[];
    recurringTotal: number;
    totalDebtOut: number;
    totalDebtIn: number;
    debts: Debt[];
    showCatAll: boolean;
    setShowCatAll: (v: boolean) => void;
    toggleRecurring: (id: number) => void;
  };
  salary: number;
  onDeposit: () => void;
  onAddExpense: () => void;
}

export function OverviewTab({
  T,
  tc,
  f,
  salary,
  onDeposit,
  onAddExpense,
}: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
      {/* Main */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <BudgetSummary
          T={T}
          tc={tc}
          spent={f.spent}
          needBudget={f.needBudget}
          wantBudget={f.wantBudget}
          futureBudget={f.futureBudget}
          totalSpent={f.totalSpent}
          totalIncome={f.totalIncome}
          dailyLeft={f.dailyLeft}
          onDeposit={onDeposit}
        />
        <ExpenseTable
          T={T}
          tc={tc}
          expenses={f.expenses}
          categories={f.categories}
          recurringExpenses={f.recurringExpenses}
          recurringTotal={f.recurringTotal}
          onAdd={onAddExpense}
          onToggleRecurring={f.toggleRecurring}
        />
      </div>

      {/* Sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Maliyyə Xülasəsi */}
        <Card title="Maliyyə Xülasəsi" T={T}>
          <Fact
            label="Aylıq gəlir"
            value={`${f.totalIncome.toFixed(2)} ₼`}
            sub={
              f.extraIncome > 0
                ? `Maaş: ${salary}₼ + ${f.extraIncome}₼`
                : undefined
            }
            T={T}
          />
          <Fact
            label="Xərclənib"
            value={`${f.totalSpent.toFixed(2)} ₼`}
            sub={`${Math.round((f.totalSpent / f.totalIncome) * 100)}%`}
            color={f.totalSpent > f.totalIncome * 0.8 ? T.danger : undefined}
            T={T}
          />
          <Fact
            label="Qalıq"
            value={`${(f.totalIncome - f.totalSpent).toFixed(2)} ₼`}
            color={f.totalIncome - f.totalSpent > 0 ? tc.future : T.danger}
            T={T}
          />
          <Fact
            label="Gündəlik limit"
            value={`${f.dailyLeft.toFixed(2)} ₼`}
            color={T.primary}
            T={T}
          />
        </Card>

        {/* Borc Xülasəsi */}
        <Card title="Borc Xülasəsi" T={T}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${T.danger}08`,
                borderRadius: 10,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: T.text3,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Verdiyim
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 18,
                  fontWeight: 700,
                  color: T.danger,
                }}
              >
                {f.totalDebtOut.toFixed(2)} ₼
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${tc.future}08`,
                borderRadius: 10,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: T.text3,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Aldığım
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 18,
                  fontWeight: 700,
                  color: tc.future,
                }}
              >
                {f.totalDebtIn.toFixed(2)} ₼
              </div>
            </div>
          </div>
          {f.debts
            .filter((d) => !d.paid)
            .map((d) => (
              <div
                key={d.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: `1px solid ${T.border}`,
                  fontSize: 12,
                }}
              >
                <span style={{ color: T.text2 }}>
                  {d.type === "lent" ? "📤" : "📥"} {d.name}
                </span>
                <span
                  style={{
                    fontFamily: MONO,
                    fontWeight: 600,
                    color: d.type === "lent" ? T.danger : tc.future,
                  }}
                >
                  {d.amount} ₼
                </span>
              </div>
            ))}
        </Card>

        {/* Kateqoriya Bölgüsü */}
        <Card title="Kateqoriya Bölgüsü" T={T}>
          {(() => {
            const cd = f.categories
              .map((c) => ({
                ...c,
                total: f.expenses
                  .filter((e) => e.category === c.id)
                  .reduce((s, e) => s + e.amount, 0),
              }))
              .filter((c) => c.total > 0)
              .sort((a, b) => b.total - a.total);
            const shown = f.showCatAll ? cd : cd.slice(0, 5);
            const hiddenCount = cd.length - 5;
            const hiddenTotal = cd.slice(5).reduce((s, c) => s + c.total, 0);
            return (
              <>
                {shown.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 0",
                      borderBottom: `1px solid ${T.border}`,
                      fontSize: 12,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{c.emoji}</span>
                    <span style={{ flex: 1, color: T.text2 }}>{c.label}</span>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontWeight: 600,
                        color: tc[c.type],
                      }}
                    >
                      {c.total} ₼
                    </span>
                  </div>
                ))}
                {hiddenCount > 0 && !f.showCatAll && (
                  <button
                    onClick={() => f.setShowCatAll(true)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: 8,
                      borderRadius: 8,
                      cursor: "pointer",
                      background: T.hoverBg,
                      border: `1px solid ${T.border}`,
                      fontSize: 12,
                      fontWeight: 600,
                      color: T.primary,
                      fontFamily: FONT,
                      transition: "all .3s ease",
                    }}
                  >
                    Digər ({hiddenCount} · {hiddenTotal}₼) ▾
                  </button>
                )}
                {f.showCatAll && cd.length > 5 && (
                  <button
                    onClick={() => f.setShowCatAll(false)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: 8,
                      borderRadius: 8,
                      cursor: "pointer",
                      background: T.hoverBg,
                      border: `1px solid ${T.border}`,
                      fontSize: 12,
                      fontWeight: 600,
                      color: T.text3,
                      fontFamily: FONT,
                    }}
                  >
                    Gizlət ▴
                  </button>
                )}
              </>
            );
          })()}
        </Card>
      </div>
    </div>
  );
}
