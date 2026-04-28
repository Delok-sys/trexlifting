import { Link } from "react-router-dom";

export function NotFoundPage({
  kicker,
  title,
  description,
  backLabel,
  backTo,
}) {
  return (
    <main className="page-shell">
      <section className="page-card">
        <p className="page-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="page-copy">{description}</p>
        <Link className="page-link" to={backTo}>
          {backLabel}
        </Link>
      </section>
    </main>
  );
}
