import { useState, useMemo, useEffect, useCallback } from "react";
import {
  type Expense,
  type Debt,
  type Category,
  type FinancialGoal,
  type ImpulseItem,
  type ExtraBudget,
  type MonthComputed,
  type Theme,
  type TypeColors,
} from "../models";
import { themes } from "../constants/themes";
import { DEFAULT_CATEGORIES } from "../constants/categories";
import { typeColorsFor, injectGlobalStyles } from "../constants/styles";
import { USER_INIT } from "../constants/userInit";
import {
  getCurrentMonthName,
  getCurrentYear,
  getCurrentMonthLabel,
  getMonthKey,
  getExpenseMonthKey,
  AZ_MONTHS,
} from "../utils/getMonths";

/* ─── Onboarding result type (must match OnboardingWizard export) ─── */
export interface OnboardingData {
  salary: number;
  avatar: { id: string; emoji: string; name: string };
  split: { need: number; want: number; future: number };
  expenses: { id: string; amount: number }[];
}

/* ─── Map onboarding expense presets to category IDs ─── */
const PRESET_TO_CATEGORY: Record<string, string> = {
  rent: "housing",
  food: "food",
  transport: "transport",
  utilities: "housing",
  phone: "housing",
  netflix: "entertainment",
  cafe: "entertainment",
  shopping: "clothing",
  gym: "hobby",
  hobby: "hobby",
};

export function useFinance() {
  // ─── Theme ───
  const [dark, setDark] = useState(false);
  const T: Theme = dark ? themes.dark : themes.light;
  const tc: TypeColors = typeColorsFor(dark ? "dark" : "light");

  // ─── User Profile (dynamic — set by onboarding) ───
  const [salary, setSalary] = useState(USER_INIT.salary);
  const [splitConfig, setSplitConfig] = useState(USER_INIT.split);
  const [avatarEmoji, setAvatarEmoji] = useState(USER_INIT.avatar.emoji);
  const [avatarName, setAvatarName] = useState(USER_INIT.avatar.name);

  // ─── Core State ───
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [extraBudget, setExtraBudget] = useState<ExtraBudget>({
    balance: 0,
    need: 0,
    want: 0,
    future: 0,
  });
  const [impulseItems, setImpulseItems] = useState<ImpulseItem[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [simPct, setSimPct] = useState(USER_INIT.split.future);

  // ─── UI State ───
  const [activeTab, setActiveTab] = useState("overview");
  const [historyMonth, setHistoryMonth] = useState<number | null>(null);
  const [showCatAll, setShowCatAll] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [checkMark, setCheckMark] = useState(false);

  // ─── Inject styles once ───
  useEffect(() => {
    injectGlobalStyles();
  }, []);

  // ═══════════════════════════════════════════════════
  // ─── Initialize from Onboarding ───
  // ═══════════════════════════════════════════════════
  const initFromOnboarding = useCallback((data: OnboardingData) => {
    // 1. Set salary
    setSalary(data.salary);

    // 2. Set split percentages
    setSplitConfig(data.split);
    setSimPct(data.split.future);

    // 3. Set avatar
    setAvatarEmoji(data.avatar.emoji);
    setAvatarName(data.avatar.name);

    // 4. Convert onboarding expenses to recurring Expense entries
    const today = new Date().toLocaleDateString("az-AZ");
    const newExpenses: Expense[] = data.expenses
      .filter((e) => e.amount > 0)
      .map((e, i) => ({
        id: Date.now() + i,
        amount: e.amount,
        category: PRESET_TO_CATEGORY[e.id] || "housing",
        mood: "happy",
        date: today,
        note: getExpenseLabel(e.id),
        recurring: true, // onboarding expenses are recurring by default
      }));

    setExpenses(newExpenses);
  }, []);

  // ─── Budget Calculations (now using dynamic salary & split) ───
  const extraIncome =
    extraBudget.balance +
    extraBudget.need +
    extraBudget.want +
    extraBudget.future;
  const totalIncome = salary + extraIncome;
  const needBudget =
    Math.round((salary * splitConfig.need) / 100) +
    Math.round((extraBudget.balance * splitConfig.need) / 100) +
    extraBudget.need;
  const wantBudget =
    Math.round((salary * splitConfig.want) / 100) +
    Math.round((extraBudget.balance * splitConfig.want) / 100) +
    extraBudget.want;
  const futureBudget = totalIncome - needBudget - wantBudget;

  // ─── Current Month (dynamic) ───
  const currentMonthName = getCurrentMonthName();
  const currentYear = getCurrentYear();
  const currentMonthLabel = getCurrentMonthLabel();
  const currentMonthKey = getMonthKey();

  // ─── Filter: only current month expenses for "spent" ───
  const currentMonthExpenses = useMemo(() => {
    return expenses.filter(
      (e) => getExpenseMonthKey(e.date) === currentMonthKey,
    );
  }, [expenses, currentMonthKey]);

  const spent = useMemo(() => {
    const s = { need: 0, want: 0, future: 0 };
    currentMonthExpenses.forEach((e) => {
      const c = categories.find((cc) => cc.id === e.category);
      if (c) s[c.type] += e.amount;
    });
    return s;
  }, [currentMonthExpenses, categories]);

  const totalSpent = spent.need + spent.want + spent.future;
  const dailyLeft = Math.max(
    0,
    Math.round((needBudget + wantBudget - spent.need - spent.want) / 30),
  );
  const totalDebtOut = debts
    .filter((d) => d.type === "lent" && !d.paid)
    .reduce((s, d) => s + Number(d.amount), 0);
  const totalDebtIn = debts
    .filter((d) => d.type === "borrowed" && !d.paid)
    .reduce((s, d) => s + Number(d.amount), 0);
  const recurringExpenses = currentMonthExpenses.filter((e) => e.recurring);
  const recurringTotal = recurringExpenses.reduce((s, e) => s + e.amount, 0);

  // ─── History: group ALL expenses by month ───
  const allMonths: MonthComputed[] = useMemo(() => {
    const monthMap: Record<
      string,
      {
        month: string;
        year: number;
        income: number;
        catAmounts: Record<string, number>;
      }
    > = {};

    // Group every expense by its month key
    expenses.forEach((e) => {
      const mk = getExpenseMonthKey(e.date);
      if (!monthMap[mk]) {
        const [y, m] = mk.split("-").map(Number);
        monthMap[mk] = {
          month: AZ_MONTHS[m - 1],
          year: y,
          income: salary,
          catAmounts: {},
        };
      }
      const entry = monthMap[mk];
      entry.catAmounts[e.category] =
        (entry.catAmounts[e.category] || 0) + e.amount;
    });

    // Ensure current month always exists even if no expenses yet
    if (!monthMap[currentMonthKey]) {
      monthMap[currentMonthKey] = {
        month: currentMonthName,
        year: currentYear,
        income: totalIncome,
        catAmounts: {},
      };
    } else {
      monthMap[currentMonthKey].income = totalIncome; // current month uses dynamic income
    }

    // Sort by key and compute need/want/future
    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, m]) => {
        const expArr = Object.entries(m.catAmounts).map(
          ([category, amount]) => ({ category, amount }),
        );
        const need = expArr
          .filter((e) => {
            const c = categories.find((cc) => cc.id === e.category);
            return c?.type === "need";
          })
          .reduce((s, e) => s + e.amount, 0);
        const want = expArr
          .filter((e) => {
            const c = categories.find((cc) => cc.id === e.category);
            return c?.type === "want";
          })
          .reduce((s, e) => s + e.amount, 0);
        const future = expArr
          .filter((e) => {
            const c = categories.find((cc) => cc.id === e.category);
            return c?.type === "future";
          })
          .reduce((s, e) => s + e.amount, 0);
        return {
          month: m.month,
          year: m.year,
          income: m.income,
          expenses: expArr,
          need,
          want,
          future,
          total: need + want + future,
        };
      });
  }, [
    expenses,
    categories,
    totalIncome,
    salary,
    currentMonthName,
    currentYear,
    currentMonthKey,
  ]);

  // ─── Actions ───
  const triggerCelebration = () => {
    setConfetti(true);
    setCheckMark(true);
    setTimeout(() => setCheckMark(false), 800);
  };

  const addCategory = (
    label: string,
    emoji: string,
    type: "need" | "want" | "future",
  ) => {
    if (!label) return;
    setCategories((p) => [
      ...p,
      { id: `c_${Date.now()}`, emoji, label, type, custom: true },
    ]);
  };

  const handleDeposit = (amount: number, target: string) => {
    if (!amount || amount <= 0) return;
    setExtraBudget((p) => ({ ...p, [target]: (p as any)[target] + amount }));
  };

  const toggleRecurring = (id: number) => {
    setExpenses((p) =>
      p.map((e) => (e.id === id ? { ...e, recurring: !e.recurring } : e)),
    );
  };

  const addExpense = (
    amount: number,
    category: string,
    mood: string,
    note: string,
    recurring: boolean,
  ) => {
    if (!amount || !category || !mood) return;
    setExpenses((p) => [
      ...p,
      {
        id: Date.now(),
        amount,
        category,
        mood,
        date: new Date().toLocaleDateString("az-AZ"),
        note: note || "",
        recurring,
      },
    ]);
  };

  const addDebt = (
    name: string,
    amount: number,
    type: "lent" | "borrowed",
    note: string,
  ) => {
    if (!name || !amount) return;
    const smartNote = note || (type === "lent" ? "Borc verdim" : "Borc aldım");
    setDebts((p) => [
      ...p,
      {
        id: Date.now(),
        name,
        amount,
        type,
        date: new Date().toLocaleDateString("az-AZ"),
        note: smartNote,
        paid: false,
      },
    ]);
  };

  const payDebt = (id: number) => {
    setDebts((p) => p.map((d) => (d.id === id ? { ...d, paid: true } : d)));
    triggerCelebration();
  };

  const addGoal = (name: string, target: number, emoji: string) => {
    if (!name || !target) return;
    setGoals((p) => [...p, { id: Date.now(), name, target, saved: 0, emoji }]);
  };

  const removeGoal = (id: number) => {
    setGoals((p) => p.filter((g) => g.id !== id));
  };

  const depositToGoal = (id: number, amount: number) => {
    setGoals((p) =>
      p.map((g) => {
        if (g.id !== id) return g;
        const newSaved = Math.min(g.target, g.saved + amount);
        if (newSaved >= g.target) triggerCelebration();
        return { ...g, saved: newSaved };
      }),
    );
  };

  const addImpulse = (name: string, amount: number) => {
    if (!name || amount <= 0) return;
    setImpulseItems((p) => [
      ...p,
      { id: Date.now(), name, amount, remainingSecs: 86400 },
    ]);
  };

  const cancelImpulse = (id: number) => {
    const item = impulseItems.find((i) => i.id === id);
    if (!item) return;
    setImpulseItems((p) => p.filter((i) => i.id !== id));
    setExpenses((p) => [
      ...p,
      {
        id: Date.now(),
        amount: item.amount,
        category: "savings",
        mood: "happy",
        date: new Date().toLocaleDateString("az-AZ"),
        note: `${item.name} → Yığıma!`,
        recurring: false,
      },
    ]);
    setConfetti(true);
  };

  const confirmImpulse = (id: number) => {
    setImpulseItems((p) => p.filter((i) => i.id !== id));
  };

  return {
    // Theme
    dark,
    setDark,
    T,
    tc,
    // User profile (dynamic)
    salary,
    splitConfig,
    avatarEmoji,
    avatarName,
    // Current month
    currentMonthLabel,
    currentMonthName,
    currentYear,
    // Data
    categories,
    expenses,
    debts,
    impulseItems,
    goals,
    extraBudget,
    // Computed
    extraIncome,
    totalIncome,
    needBudget,
    wantBudget,
    futureBudget,
    spent,
    totalSpent,
    dailyLeft,
    totalDebtOut,
    totalDebtIn,
    recurringExpenses,
    recurringTotal,
    allMonths,
    simPct,
    // UI state
    activeTab,
    setActiveTab,
    historyMonth,
    setHistoryMonth,
    showCatAll,
    setShowCatAll,
    confetti,
    setConfetti,
    checkMark,
    // Actions
    initFromOnboarding,
    setSimPct,
    addCategory,
    handleDeposit,
    toggleRecurring,
    addExpense,
    addDebt,
    payDebt,
    addGoal,
    removeGoal,
    depositToGoal,
    addImpulse,
    cancelImpulse,
    confirmImpulse,
  };
}

/* ─── Helper: Map preset ID to readable label ─── */
function getExpenseLabel(presetId: string): string {
  const labels: Record<string, string> = {
    rent: "Kirayə / İpoteka",
    food: "Qida / Market",
    transport: "Nəqliyyat",
    utilities: "Kommunal",
    phone: "Telefon / İnternet",
    netflix: "Netflix / Streaming",
    cafe: "Kafe / Restoran",
    shopping: "Geyim / Alış-veriş",
    gym: "İdman zalı",
    hobby: "Hobbi",
  };
  return labels[presetId] || presetId;
}
