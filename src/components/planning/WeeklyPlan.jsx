import { WorkoutDayCard } from "./WorkoutDayCard";

export function WeeklyPlan({ block, onWeekChange, getWorkoutFeedback, onFeedbackSubmit }) {
  if (!block) {
    return (
      <section className="panel panel--soft">
        <p className="form-feedback">
          Erstelle zuerst einen Block, damit der Wochenplan mit Gewichten und RPE-Zielen angezeigt
          wird.
        </p>
      </section>
    );
  }

  const currentWeek = block.weeks.find((week) => week.weekNumber === block.currentWeek);

  if (!currentWeek) {
    return (
      <section className="panel panel--soft">
        <p className="form-feedback">Die ausgewaehlte Woche ist nicht verfuegbar.</p>
      </section>
    );
  }

  const todaysWorkout =
    currentWeek.days.find((day) => !getWorkoutFeedback(currentWeek.weekNumber, day.id)) ??
    currentWeek.days[0];

  return (
    <section className="page-stack page-stack--lg" aria-labelledby="weekly-plan-head">
      <div className="panel page-stack page-stack--sm">
        <div className="page-section-head">
          <p className="section-kicker">Wochenplan</p>
          <h2 id="weekly-plan-head">Woche {currentWeek.weekNumber}</h2>
        </div>

        <div className="action-row">
          <button
            className="button button--ghost button--small"
            type="button"
            onClick={() => onWeekChange(block.currentWeek - 1)}
            disabled={block.currentWeek <= 1}
          >
            Vorherige Woche
          </button>

          <button
            className="button button--ghost button--small"
            type="button"
            onClick={() => onWeekChange(block.currentWeek + 1)}
            disabled={block.currentWeek >= block.settings.durationWeeks}
          >
            Naechste Woche
          </button>
        </div>

        <article className="panel panel--soft page-stack page-stack--sm">
          <p className="section-kicker">Heutiges Workout</p>
          <h3>{todaysWorkout.title}</h3>
          <p className="form-feedback">
            Fokus heute: {todaysWorkout.exercises[0]?.name ?? "Trainingseinheit"}.
          </p>
        </article>
      </div>

      {currentWeek.days.map((day) => (
        <WorkoutDayCard
          key={day.id}
          day={day}
          weekNumber={currentWeek.weekNumber}
          storedFeedback={getWorkoutFeedback(currentWeek.weekNumber, day.id)}
          onFeedbackSubmit={onFeedbackSubmit}
        />
      ))}
    </section>
  );
}
