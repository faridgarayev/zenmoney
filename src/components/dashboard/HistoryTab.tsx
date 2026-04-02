import { MONO } from "../../constants/styles";
import {
  type Theme,
  type TypeColors,
  type Category,
  type MonthComputed,
} from "../../models";
import { Card, Fact } from "../ui/ThemedComponents";

interface Props {
  T: Theme;
  tc: TypeColors;
  allMonths: MonthComputed[];
  historyMonth: number | null;
  setHistoryMonth: (i: number) => void;
  categories: Category[];
  currentMonthName: string;
}

const TABLE_COLS = "1fr 90px 90px 90px 100px 100px";

export function HistoryTab({
  T,
  tc,
  allMonths,
  historyMonth,
  setHistoryMonth,
  categories,
  currentMonthName,
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
    padding: "11px 12px",
    fontSize: 13,
    color: T.text1,
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Bar Chart */}
        <Card title="Aylıq Xərc Dinamikası" T={T}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 14,
              height: 190,
              marginBottom: 16,
            }}
          >
            {allMonths.map((m, i) => {
              const mx = Math.max(...allMonths.map((x) => x.total), 1);
              const act = m.month === currentMonthName;
              return (
                <div
                  key={i}
                  onClick={() => setHistoryMonth(i)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                    opacity:
                      historyMonth !== null && historyMonth !== i ? 0.4 : 1,
                    transition: "opacity .3s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: MONO,
                      fontWeight: 700,
                      color: act ? T.primary : T.text2,
                    }}
                  >
                    {m.total}₼
                  </span>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {m.future > 0 && (
                      <div
                        style={{
                          height: Math.max(4, (m.future / mx) * 150),
                          borderRadius: 4,
                          background: tc.future,
                          transition: "height .4s ease",
                        }}
                      />
                    )}
                    {m.want > 0 && (
                      <div
                        style={{
                          height: Math.max(4, (m.want / mx) * 150),
                          borderRadius: 4,
                          background: tc.want,
                          transition: "height .4s ease",
                        }}
                      />
                    )}
                    {m.need > 0 && (
                      <div
                        style={{
                          height: Math.max(4, (m.need / mx) * 150),
                          borderRadius: 4,
                          background: tc.need,
                          transition: "height .4s ease",
                        }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: act ? 700 : 400,
                      color: act ? T.primary : T.text3,
                    }}
                  >
                    {m.month.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              borderTop: `1px solid ${T.border}`,
              paddingTop: 12,
            }}
          >
            {[
              { l: "Zəruri", c: tc.need },
              { l: "İstəklər", c: tc.want },
              { l: "Yığım", c: tc.future },
            ].map((x) => (
              <div
                key={x.l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: T.text2,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: x.c,
                  }}
                />
                {x.l}
              </div>
            ))}
          </div>
        </Card>

        {/* Comparison Table — CSS Grid */}
        <Card title="Ay Üzrə Müqayisə" T={T}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: TABLE_COLS }}>
            <div style={headerCell}>Dövr</div>
            <div style={{ ...headerCell, textAlign: "right" }}>Zəruri</div>
            <div style={{ ...headerCell, textAlign: "right" }}>İstəklər</div>
            <div style={{ ...headerCell, textAlign: "right" }}>Yığım</div>
            <div style={{ ...headerCell, textAlign: "right" }}>Cəmi</div>
            <div style={{ ...headerCell, textAlign: "right" }}>Qalıq</div>
          </div>

          {/* Rows */}
          {allMonths.map((m, i) => {
            const cur = m.month === currentMonthName;
            const rem = m.income - m.total;
            return (
              <div
                key={i}
                onClick={() => setHistoryMonth(i)}
                style={{
                  display: "grid",
                  gridTemplateColumns: TABLE_COLS,
                  cursor: "pointer",
                  background: cur ? T.activeBg : "transparent",
                  transition: "background .2s",
                }}
                onMouseEnter={(e) => {
                  if (!cur) e.currentTarget.style.background = T.tableHover;
                }}
                onMouseLeave={(e) => {
                  if (!cur) e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    ...cell,
                    fontWeight: cur ? 700 : 400,
                    color: cur ? T.primary : T.text1,
                  }}
                >
                  {m.month} {m.year} {cur && "◄"}
                </div>
                <div
                  style={{
                    ...cell,
                    textAlign: "right",
                    fontFamily: MONO,
                    color: tc.need,
                  }}
                >
                  {m.need.toFixed(2)}
                </div>
                <div
                  style={{
                    ...cell,
                    textAlign: "right",
                    fontFamily: MONO,
                    color: tc.want,
                  }}
                >
                  {m.want.toFixed(2)}
                </div>
                <div
                  style={{
                    ...cell,
                    textAlign: "right",
                    fontFamily: MONO,
                    color: tc.future,
                  }}
                >
                  {m.future.toFixed(2)}
                </div>
                <div
                  style={{
                    ...cell,
                    textAlign: "right",
                    fontFamily: MONO,
                    fontWeight: 700,
                  }}
                >
                  {m.total.toFixed(2)}
                </div>
                <div
                  style={{
                    ...cell,
                    textAlign: "right",
                    fontFamily: MONO,
                    fontWeight: 600,
                    color: rem >= 0 ? tc.future : T.danger,
                  }}
                >
                  {rem >= 0 ? "+" : ""}
                  {rem.toFixed(2)}
                </div>
              </div>
            );
          })}

          {allMonths.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: T.text3,
                fontSize: 13,
              }}
            >
              Tarixçə boşdur — xərc əlavə etdikdə burada görünəcək
            </div>
          )}
        </Card>
      </div>

      {/* Month Detail Sidebar */}
      <Card
        title={
          historyMonth !== null
            ? `${allMonths[historyMonth].month} ${allMonths[historyMonth].year}`
            : "Ay seçin →"
        }
        T={T}
      >
        {historyMonth !== null ? (
          (() => {
            const m = allMonths[historyMonth];
            return (
              <div>
                <Fact label="Gəlir" value={`${m.income} ₼`} T={T} />
                <Fact
                  label="Zəruri"
                  value={`${m.need} ₼`}
                  color={tc.need}
                  sub={`${Math.round((m.need / m.income) * 100)}%`}
                  T={T}
                />
                <Fact
                  label="İstəklər"
                  value={`${m.want} ₼`}
                  color={tc.want}
                  sub={`${Math.round((m.want / m.income) * 100)}%`}
                  T={T}
                />
                <Fact
                  label="Yığım"
                  value={`${m.future} ₼`}
                  color={tc.future}
                  sub={`${Math.round((m.future / m.income) * 100)}%`}
                  T={T}
                />
                <Fact
                  label="Qalıq"
                  value={`${m.income - m.total} ₼`}
                  color={m.income - m.total >= 0 ? tc.future : T.danger}
                  T={T}
                />
                <div
                  style={{
                    marginTop: 16,
                    fontSize: 10,
                    color: T.text3,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 8,
                  }}
                >
                  Kateqoriyalar
                </div>
                {m.expenses
                  .sort((a, b) => b.amount - a.amount)
                  .map((ex, ei) => {
                    const cat = categories.find((c) => c.id === ex.category);
                    return (
                      cat && (
                        <div
                          key={ei}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "6px 0",
                            fontSize: 12,
                            borderBottom: `1px solid ${T.border}`,
                          }}
                        >
                          <span>
                            {cat.emoji} {cat.label}
                          </span>
                          <span
                            style={{
                              fontFamily: MONO,
                              fontWeight: 600,
                              color: tc[cat.type],
                            }}
                          >
                            {ex.amount} ₼
                          </span>
                        </div>
                      )
                    );
                  })}
              </div>
            );
          })()
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: T.text3,
              fontSize: 13,
            }}
          >
            Cədvəldə bir aya klikləyin
          </div>
        )}
      </Card>
    </div>
  );
}
