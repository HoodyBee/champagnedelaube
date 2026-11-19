/** Texte simple : une ligne commençant par « • » devient un élément de liste. */
export function Paragraphs({ text }: { text: string }) {
  const lines = text.split("\n").filter(Boolean);
  const blocks: (string | string[])[] = [];
  for (const line of lines) {
    if (line.startsWith("• ")) {
      const last = blocks.at(-1);
      if (Array.isArray(last)) last.push(line.slice(2));
      else blocks.push([line.slice(2)]);
    } else blocks.push(line);
  }
  return (
    <div className="mt-space-2 space-y-space-2 text-[1.0625rem]">
      {blocks.map((b, i) =>
        Array.isArray(b) ? (
          <ul key={i} className="list-disc space-y-1 pl-space-3 marker:text-or">
            {b.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{b}</p>
        ),
      )}
    </div>
  );
}
