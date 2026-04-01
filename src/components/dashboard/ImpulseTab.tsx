import { FONT } from "../../constants/styles";
import { type Theme, type ImpulseItem } from "../../types/finance";
import { Card, Btn } from "../ui/ThemedComponents";
import { ImpTimer } from "./DebtManager";

interface Props {
  T: Theme;
  impulseItems: ImpulseItem[];
  onCancel: (id: number) => void;
  onConfirm: (id: number) => void;
  onAdd: (name: string, amount: number) => void;
}

export function ImpulseTab({
  T,
  impulseItems,
  onCancel,
  onConfirm,
  onAdd,
}: Props) {
  const inputStyle: React.CSSProperties = {
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
  };

  const handleAdd = () => {
    const nameEl = document.getElementById("imp-n") as HTMLInputElement;
    const amountEl = document.getElementById("imp-a") as HTMLInputElement;
    const n = nameEl.value;
    const a = Number(amountEl.value);
    if (n && a > 0) {
      onAdd(n, a);
      nameEl.value = "";
      amountEl.value = "";
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <Card title="Soyutma Taymeri" T={T}>
        <div style={{ fontSize: 13, color: T.text2, marginBottom: 18 }}>
          Bir şey almaq istəyirsən? 24 saat gözlə, sonra qərar ver.
        </div>
        {impulseItems.map((item) => (
          <ImpTimer
            key={item.id}
            item={item}
            T={T}
            onCancel={() => onCancel(item.id)}
            onConfirm={() => onConfirm(item.id)}
          />
        ))}
        {impulseItems.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "40px 0", color: T.text3 }}
          >
            Heç bir impulsiv istək yoxdur — əla iradə! 🎉
          </div>
        )}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: 10,
            padding: "16px",
            background: T.hoverBg,
            borderRadius: 10,
            border: `1px solid ${T.border}`,
            transition: "all .4s ease",
          }}
        >
          <input
            placeholder="Nə almaq istəyirsən?"
            id="imp-n"
            style={inputStyle}
          />
          <input
            placeholder="₼"
            type="number"
            id="imp-a"
            style={{ ...inputStyle, width: 110, textAlign: "right" }}
          />
          <Btn primary onClick={handleAdd} T={T}>
            🧊 Dondur
          </Btn>
        </div>
      </Card>
    </div>
  );
}
