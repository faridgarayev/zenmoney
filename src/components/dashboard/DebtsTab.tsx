import { type Theme, type TypeColors, type Debt } from "../../types/finance";
import { DebtTable, DebtSummary } from "./DebtManager";

interface Props {
  T: Theme;
  tc: TypeColors;
  debts: Debt[];
  totalDebtOut: number;
  totalDebtIn: number;
  onPay: (id: number) => void;
  onAddNew: () => void;
}

export function DebtsTab({
  T,
  tc,
  debts,
  totalDebtOut,
  totalDebtIn,
  onPay,
  onAddNew,
}: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
      <DebtTable
        T={T}
        tc={tc}
        debts={debts}
        onPay={onPay}
        onAddNew={onAddNew}
      />
      <DebtSummary
        T={T}
        tc={tc}
        totalOut={totalDebtOut}
        totalIn={totalDebtIn}
      />
    </div>
  );
}
