import {
  type Theme,
  type TypeColors,
  type FinancialGoal,
} from "../../types/finance";
import { Card } from "../ui/ThemedComponents";
import { FutureSim, GoalsList, AddGoalForm } from "./FutureMe";

interface Props {
  T: Theme;
  tc: TypeColors;
  totalIncome: number;
  simPct: number;
  goals: FinancialGoal[];
  onPctChange: (v: number) => void;
  onAddGoal: (name: string, target: number, emoji: string) => void;
  onRemoveGoal: (id: number) => void;
  onDepositGoal: (id: number, amount: number) => void;
}

export function FutureTab({
  T,
  tc,
  totalIncome,
  simPct,
  goals,
  onPctChange,
  onAddGoal,
  onRemoveGoal,
  onDepositGoal,
}: Props) {
  const simMonthly = Math.round((totalIncome * simPct) / 100);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Card title="Gələcək Mən Simulyatoru" T={T}>
          <div style={{ fontSize: 13, color: T.text2, marginBottom: 16 }}>
            Yığım faizini dəyiş, gələcəyini real vaxtda gör
          </div>
          <FutureSim
            salary={totalIncome}
            futurePct={simPct}
            onPctChange={onPctChange}
            T={T}
          />
        </Card>
        <AddGoalForm T={T} onAdd={onAddGoal} />
      </div>
      <Card title="Maliyyə Hədəfləri" T={T}>
        <GoalsList
          T={T}
          tc={tc}
          goals={goals}
          simMonthly={simMonthly}
          onRemove={onRemoveGoal}
          onDeposit={onDepositGoal}
        />
      </Card>
    </div>
  );
}
