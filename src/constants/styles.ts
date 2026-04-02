import type { TypeColors } from "../models";

export const typeColorsFor = (mode: "dark" | "light"): TypeColors =>
  mode === "dark"
    ? { need: "#58A6FF", want: "#D29922", future: "#3FB950" }
    : { need: "#2563EB", want: "#D97706", future: "#059669" };

export const typeLabels: Record<string, string> = {
  need: "Zəruri",
  want: "İstəklər",
  future: "Yığım",
};

export const FONT =
  "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif";
export const MONO = "'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace";

export function injectGlobalStyles() {
  if (document.getElementById("zm-premium")) return;
  const s = document.createElement("style");
  s.id = "zm-premium";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}::selection{background:#2563EB33}
    input[type=range]{-webkit-appearance:none;height:5px;border-radius:5px;outline:none;transition:background .4s ease}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.2)}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{border-radius:3px}
    @keyframes confettiFall{0%{opacity:1;transform:translateY(0) rotate(0deg) scale(1)}100%{opacity:0;transform:translateY(200px) rotate(720deg) scale(0.3)}}
    @keyframes checkPop{0%{opacity:0;transform:scale(0.3)}50%{opacity:1;transform:scale(1.2)}100%{opacity:0;transform:scale(1)}}
  `;
  document.head.appendChild(s);
}
