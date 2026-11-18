/** Bandeau de chiffres clés (ex. sous l'ouverture). */
export function Chiffres({ items }: { items: { valeur: string; label: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="border-b border-filet bg-blanc">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-space-3 px-space-2 py-space-3 sm:px-space-4 md:grid-cols-4">
        {items.map((c) => (
          <div key={c.label} className="flex flex-col items-center text-center">
            <dt className="order-2 mt-1 text-legende text-gris-chaud">{c.label}</dt>
            <dd className="order-1 text-accroche text-bronze">{c.valeur}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
