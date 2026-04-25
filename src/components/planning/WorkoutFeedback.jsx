import { useState } from "react";

function toNumber(value, fallback = 8) {
  const parsed = Number.parseFloat(`${value ?? ""}`.replace(",", "."));

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
}

export function WorkoutFeedback({ plannedRpeDefault, storedFeedback, onSubmit }) {
  const [plannedRpe, setPlannedRpe] = useState(storedFeedback?.plannedRpe ?? plannedRpeDefault ?? 8);
  const [actualRpe, setActualRpe] = useState(storedFeedback?.actualRpe ?? plannedRpeDefault ?? 8);
  const [completedAllReps, setCompletedAllReps] = useState(storedFeedback?.completedAllReps ?? true);
  const [techniqueStable, setTechniqueStable] = useState(storedFeedback?.techniqueStable ?? true);
  const [note, setNote] = useState(storedFeedback?.note ?? "");
  const [recommendation, setRecommendation] = useState(storedFeedback?.recommendation ?? null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const feedbackPayload = {
      plannedRpe: toNumber(plannedRpe, 8),
      actualRpe: toNumber(actualRpe, 8),
      completedAllReps,
      techniqueStable,
      note: note.trim(),
    };

    const nextRecommendation = onSubmit(feedbackPayload);
    setRecommendation(nextRecommendation);
  };

  return (
    <section className="panel panel--soft page-stack" aria-label="Workout Feedback">
      <h4>Workout Feedback</h4>

      <form className="page-stack page-stack--sm" onSubmit={handleSubmit}>
        <div className="card-grid">
          <label className="form-field">
            <span>Geplante RPE</span>
            <input
              type="number"
              min="6"
              max="10"
              step="0.5"
              value={plannedRpe}
              onChange={(event) => setPlannedRpe(event.target.value)}
            />
          </label>

          <label className="form-field">
            <span>Tatsaechliche RPE</span>
            <input
              type="number"
              min="6"
              max="10"
              step="0.5"
              value={actualRpe}
              onChange={(event) => setActualRpe(event.target.value)}
            />
          </label>
        </div>

        <div className="smart-plan-inline-settings">
          <label className="smart-plan-checkbox">
            <input
              type="checkbox"
              checked={completedAllReps}
              onChange={(event) => setCompletedAllReps(event.target.checked)}
            />
            <span>Alle Reps geschafft</span>
          </label>

          <label className="smart-plan-checkbox">
            <input
              type="checkbox"
              checked={techniqueStable}
              onChange={(event) => setTechniqueStable(event.target.checked)}
            />
            <span>Technik stabil</span>
          </label>
        </div>

        <label className="form-field">
          <span>Notiz</span>
          <textarea
            className="strength-notes"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="z. B. Bench Lockout langsam, letzte Wiederholung grindy"
          />
        </label>

        <div className="action-row">
          <button type="submit" className="button button--secondary button--small">
            Feedback speichern
          </button>
        </div>
      </form>

      {recommendation ? (
        <article className="result-panel smart-plan-recommendation">
          <span>{recommendation.title}</span>
          <strong>{recommendation.message}</strong>
        </article>
      ) : null}
    </section>
  );
}
