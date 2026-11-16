// Le Studio a sa propre mise en page, sans l'en-tête ni le pied de page du site.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
