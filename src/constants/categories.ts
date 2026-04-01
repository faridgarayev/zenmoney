import type { Category } from "../models";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "housing", emoji: "🏠", label: "Yaşayış & Ev", type: "need" },
  { id: "food", emoji: "🛒", label: "Qida", type: "need" },
  { id: "transport", emoji: "🚌", label: "Nəqliyyat", type: "need" },
  { id: "health", emoji: "🏥", label: "Sağlamlıq", type: "need" },
  { id: "personal", emoji: "✂️", label: "Şəxsi qulluq", type: "need" },
  { id: "family", emoji: "👨‍👩‍👧", label: "Ailə", type: "need" },
  { id: "entertainment", emoji: "🎭", label: "Əyləncə", type: "want" },
  { id: "clothing", emoji: "👔", label: "Geyim", type: "want" },
  { id: "tech", emoji: "🎧", label: "Texnologiya", type: "want" },
  { id: "hobby", emoji: "💪", label: "Hobbilər", type: "want" },
  { id: "gifts", emoji: "🎁", label: "Hədiyyələr", type: "want" },
  { id: "relationship", emoji: "❤️", label: "Sevgili", type: "want" },
  { id: "savings", emoji: "🏦", label: "Yığım", type: "future" },
  { id: "gold", emoji: "🪙", label: "Qızıl", type: "future" },
  { id: "forex", emoji: "💶", label: "Euro & Dollar", type: "future" },
  { id: "crypto", emoji: "₿", label: "Crypto", type: "future" },
  { id: "invest", emoji: "📈", label: "İnvestisiya", type: "future" },
  { id: "education", emoji: "🎓", label: "Təhsil / Kurslar", type: "future" },
];
