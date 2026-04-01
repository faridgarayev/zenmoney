import { FONT } from "../../constants/styles";
import { type Theme } from "../../types/finance";

/* ═══ Modal Overlay Wrapper ═══ */
export function ModalWrap({
  T,
  children,
  onClose,
}: {
  T: Theme;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: T.modalOverlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background .4s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "95%",
          maxWidth: 540,
          background: T.cardBg,
          borderRadius: 16,
          boxShadow: T.shadowLg,
          maxHeight: "90vh",
          overflowY: "auto",
          transition: "background .4s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ═══ Modal Header with Title + Close ═══ */
export function ModalHeader({
  T,
  title,
  onClose,
}: {
  T: Theme;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        padding: "20px 24px",
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 17, fontWeight: 700, color: T.text1 }}>
        {title}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          fontSize: 20,
          cursor: "pointer",
          color: T.text3,
        }}
      >
        ✕
      </button>
    </div>
  );
}

/* ═══ Shared Input Style Generator ═══ */
export const getInputStyle = (T: Theme): React.CSSProperties => ({
  width: "100%",
  padding: "10px 14px",
  fontSize: 13,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  color: T.text1,
  outline: "none",
  fontFamily: FONT,
  background: T.inputBg,
  transition: "all .4s ease",
});
