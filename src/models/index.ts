export interface Expense {
  id: number;
  amount: number;
  category: string;
  mood: string;
  date: string;
  note: string;
  recurring: boolean;
}

export interface Debt {
  id: number;
  name: string;
  amount: number;
  type: "lent" | "borrowed";
  date: string;
  note: string;
  paid: boolean;
}

export interface Category {
  id: string;
  emoji: string;
  label: string;
  type: "need" | "want" | "future";
  custom?: boolean;
}

export interface FinancialGoal {
  id: number;
  name: string;
  target: number;
  saved: number;
  emoji: string;
}

export interface Mood {
  emoji: string;
  label: string;
  key: string;
}

export interface ImpulseItem {
  id: number;
  name: string;
  amount: number;
  remainingSecs: number;
}

export interface ExtraBudget {
  balance: number;
  need: number;
  want: number;
  future: number;
}

export interface MonthHistory {
  month: string;
  year: number;
  income: number;
  expenses: { category: string; amount: number }[];
}

export interface MonthComputed extends MonthHistory {
  need: number;
  want: number;
  future: number;
  total: number;
}

export interface Theme {
  name: string;
  bg: string;
  cardBg: string;
  headerBg: string;
  border: string;
  borderLight: string;
  text1: string;
  text2: string;
  text3: string;
  primary: string;
  primaryLight: string;
  primarySoft: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  shadow: string;
  shadowLg: string;
  inputBg: string;
  modalOverlay: string;
  hoverBg: string;
  activeBg: string;
  tableBg: string;
  tableHover: string;
}

export interface TypeColors {
  need: string;
  want: string;
  future: string;
}

export interface IOnboardingResult {
  salary: number;
  avatar: { id: string; emoji: string; name: string };
  split: { need: number; want: number; future: number };
  expenses: { id: string; amount: number }[];
}
