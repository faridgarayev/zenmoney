import { MONO } from "../../constants/styles";
import { USER_INIT } from "../../constants/userInit";
import { type Theme, type TypeColors } from "../../models";
import { Card, Btn, Progress } from "../ui/ThemedComponents";

interface Props {
  T: Theme;
  tc: TypeColors;
  spent: { need: number; want: number; future: number };
  needBudget: number;
  wantBudget: number;
  futureBudget: number;
  totalSpent: number;
  totalIncome: number;
  dailyLeft: number;
  onDeposit: () => void;
}

export function BudgetSummary({
  T,
  tc,
  spent,
  needBudget,
  wantBudget,
  futureBudget,
  totalSpent,
  totalIncome,
  dailyLeft,
  onDeposit,
}: Props) {
  const kpis = [
    {
      label: "Gündəlik limit",
      value: `${dailyLeft} ₼`,
      color: dailyLeft < 15 ? T.danger : T.primary,
      sub: "Bu gün",
    },
    {
      label: "Zəruri",
      value: `${spent.need} ₼`,
      color: tc.need,
      sub: `/ ${needBudget} ₼`,
    },
    {
      label: "İstəklər",
      value: `${spent.want} ₼`,
      color: tc.want,
      sub: `/ ${wantBudget} ₼`,
    },
    {
      label: "Yığım",
      value: `${spent.future} ₼`,
      color: tc.future,
      sub:
        spent.future > futureBudget
          ? `+${spent.future - futureBudget}₼ artıq ✓`
          : `/ ${futureBudget} ₼`,
    },
  ];

  const rows = [
    {
      label: `Zəruri (${USER_INIT.split.need}%)`,
      spent: spent.need,
      budget: needBudget,
      color: tc.need,
      allowOver: false,
    },
    {
      label: `İstəklər (${USER_INIT.split.want}%)`,
      spent: spent.want,
      budget: wantBudget,
      color: tc.want,
      allowOver: false,
    },
    {
      label: `Yığım (${USER_INIT.split.future}%)`,
      spent: spent.future,
      budget: futureBudget,
      color: tc.future,
      allowOver: true,
    },
  ];

  return (
    <>
      {/* KPI Tiles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
      >
        {kpis.map((k, i) => (
          <div
            key={i}
            style={{
              background: T.cardBg,
              borderRadius: 12,
              padding: "20px",
              boxShadow: T.shadow,
              borderTop: `3px solid ${k.color}`,
              transition: "all .4s ease",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: T.text3,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontWeight: 600,
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: k.color,
                fontFamily: MONO,
                letterSpacing: -1,
              }}
            >
              {k.value}
            </div>
            <div style={{ fontSize: 11, color: T.text3, marginTop: 6 }}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Budget Progress */}
      <Card
        title="Büdcə İcrası"
        actions={
          <Btn small primary onClick={onDeposit} T={T}>
            💰 Əlavə gəlir
          </Btn>
        }
        T={T}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {rows.map((r) => {
            const over = r.spent > r.budget;
            const pct = Math.round((r.spent / (r.budget || 1)) * 100);
            return (
              <div key={r.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontWeight: 600, color: T.text1 }}>
                    {r.label}
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      color:
                        over && !r.allowOver
                          ? T.danger
                          : over
                            ? tc.future
                            : T.text2,
                    }}
                  >
                    {r.spent} / {r.budget} ₼ ({pct}%)
                    {over && r.allowOver && " ✓"}
                    {over && !r.allowOver && " ⚠"}
                  </span>
                </div>
                <Progress
                  value={r.spent}
                  max={r.budget}
                  color={over && !r.allowOver ? T.danger : r.color}
                  height={6}
                  T={T}
                />
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
                fontSize: 13,
              }}
            >
              <span style={{ fontWeight: 700 }}>Ümumi</span>
              <span style={{ fontFamily: MONO, fontWeight: 700 }}>
                {totalSpent} / {totalIncome} ₼
              </span>
            </div>
            <Progress
              value={totalSpent}
              max={totalIncome}
              color={totalSpent > totalIncome * 0.9 ? T.danger : T.primary}
              height={6}
              T={T}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
