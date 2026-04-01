import { FONT } from "../../constants/styles";
import { type Theme } from "../../models";

interface Tab {
  id: string;
  label: string;
  badge?: string | null;
}

interface Props {
  T: Theme;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TabBar({ T, tabs, activeTab, onTabChange }: Props) {
  return (
    <div
      style={{
        background: T.cardBg,
        borderBottom: `1px solid ${T.border}`,
        padding: "0 32px",
        display: "flex",
        gap: 4,
        transition: "all .4s ease",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: "14px 22px",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: FONT,
            background: "transparent",
            color: activeTab === tab.id ? T.primary : T.text3,
            borderBottom:
              activeTab === tab.id
                ? `2px solid ${T.primary}`
                : "2px solid transparent",
            transition: "all .3s ease",
          }}
        >
          {tab.label}
          {tab.badge && (
            <span
              style={{
                marginLeft: 6,
                padding: "2px 7px",
                borderRadius: 8,
                background: `${T.warning}20`,
                color: T.warning,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
