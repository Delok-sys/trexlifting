export function OfferPage({
  kicker,
  title,
  description,
}) {
  return (
    <main className="page-shell">
      <section className="page-card">
        <p className="page-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="page-copy">{description}</p>
      </section>
    </main>
  );
}
