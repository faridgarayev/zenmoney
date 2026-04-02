import { useState } from "react";
import { useFinance } from "./hooks/useFinance";

// Constants
import { USER_INIT } from "./constants/userInit";
import { FONT } from "./constants/styles";

// Onboarding
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import type { IOnboardingResult } from "./models";

// Layout
import { AppHeader } from "./components/layout/AppHeader";
import { TabBar } from "./components/layout/TabBar";

// UI
import { Confetti, CheckMark } from "./components/ui/ThemedComponents";

// Tabs
import { OverviewTab } from "./components/dashboard/OverviewTab";
import { HistoryTab } from "./components/dashboard/HistoryTab";
import { DebtsTab } from "./components/dashboard/DebtsTab";
import { ImpulseTab } from "./components/dashboard/ImpulseTab";
import { FutureTab } from "./components/dashboard/Futuretab";

// Modals
import {
  AddExpenseModal,
  AddDebtModal,
  DepositModal,
} from "./components/modals";


export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const f = useFinance();
  const { T, tc } = f;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  /* ─── Onboarding → Dashboard ─── */
  const handleOnboardingComplete = (result: IOnboardingResult) => {
    f.initFromOnboarding(result);
    setOnboarded(true);
  };

  if (!onboarded) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  /* ─── Dashboard ─── */
  const tabs = [
    { id: "overview", label: "İcmal" },
    { id: "history", label: "Tarixçə" },
    {
      id: "debts",
      label: "Borclar",
      badge: f.totalDebtOut > 0 ? `${f.totalDebtOut}₼` : null,
    },
    { id: "impulse", label: "Soyuducu" },
    { id: "future", label: "Gələcək Mən" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: FONT,
        color: T.text1,
        transition: "all .4s ease",
      }}
    >
      <Confetti active={f.confetti} onDone={() => f.setConfetti(false)} />
      <CheckMark show={f.checkMark} />

      <AppHeader
        T={T}
        dark={f.dark}
        setDark={f.setDark}
        extraIncome={f.extraIncome}
        month={USER_INIT.month}
        streak={USER_INIT.streak}
        avatarEmoji={f.avatarEmoji}
      />

      <TabBar
        T={T}
        tabs={tabs}
        activeTab={f.activeTab}
        onTabChange={f.setActiveTab}
      />

      <div style={{ padding: "28px 32px 60px" }}>
        {f.activeTab === "overview" && (
          <OverviewTab
            T={T}
            tc={tc}
            f={f}
            salary={f.salary}
            onDeposit={() => setShowDepositModal(true)}
            onAddExpense={() => setShowAddModal(true)}
          />
        )}

        {f.activeTab === "history" && (
          <HistoryTab
            T={T}
            tc={tc}
            allMonths={f.allMonths}
            historyMonth={f.historyMonth}
            setHistoryMonth={f.setHistoryMonth}
            categories={f.categories}
          />
        )}

        {f.activeTab === "debts" && (
          <DebtsTab
            T={T}
            tc={tc}
            debts={f.debts}
            totalDebtOut={f.totalDebtOut}
            totalDebtIn={f.totalDebtIn}
            onPay={f.payDebt}
            onAddNew={() => setShowDebtModal(true)}
          />
        )}

        {f.activeTab === "impulse" && (
          <ImpulseTab
            T={T}
            impulseItems={f.impulseItems}
            onCancel={f.cancelImpulse}
            onConfirm={f.confirmImpulse}
            onAdd={f.addImpulse}
          />
        )}

        {f.activeTab === "future" && (
          <FutureTab
            T={T}
            tc={tc}
            totalIncome={f.totalIncome}
            simPct={f.simPct}
            goals={f.goals}
            onPctChange={f.setSimPct}
            onAddGoal={f.addGoal}
            onRemoveGoal={f.removeGoal}
            onDepositGoal={f.depositToGoal}
          />
        )}
      </div>

      {showAddModal && (
        <AddExpenseModal
          T={T}
          tc={tc}
          categories={f.categories}
          onClose={() => setShowAddModal(false)}
          onAdd={f.addExpense}
          onAddCategory={f.addCategory}
        />
      )}
      {showDebtModal && (
        <AddDebtModal
          T={T}
          tc={tc}
          onClose={() => setShowDebtModal(false)}
          onAdd={f.addDebt}
        />
      )}
      {showDepositModal && (
        <DepositModal
          T={T}
          tc={tc}
          onClose={() => setShowDepositModal(false)}
          onDeposit={f.handleDeposit}
        />
      )}
    </div>
  );
}
