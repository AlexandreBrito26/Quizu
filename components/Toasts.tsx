import type { Achievement } from "@/data/achievements";
import { toBerries } from "@/lib/ranks";

export default function Toasts({ items }: { items: Achievement[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="unlocked" aria-label="Conquistas desbloqueadas">
      {items.map((a) => (
        <li key={a.id}>
          <span aria-hidden="true">{a.emoji}</span>
          <span>
            <strong>Conquista: {a.name}</strong>
            <small>+{toBerries(a.reward)}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}
