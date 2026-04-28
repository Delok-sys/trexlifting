import { describeWeightReason } from "../../lib/trainingPlanEngine";
import { WorkoutFeedback } from "./WorkoutFeedback";

function renderReps(exercise) {
  return `${exercise.sets} x ${exercise.reps}`;
}

function getPlannedRpe(day) {
  const topSet = day.exercises.find((exercise) => exercise.name.includes("Top Set"));
  return topSet?.targetRpe ?? 8;
}

export function WorkoutDayCard({ day, weekNumber, storedFeedback, onFeedbackSubmit }) {
  return (
    <article className="panel page-stack page-stack--lg">
      <div className="page-section-head">
        <p className="section-kicker">{day.title}</p>
        {day.dayNote ? <p className="form-feedback">{day.dayNote}</p> : null}
      </div>

      <div className="smart-plan-exercise-list">
        {day.exercises.map((exercise) => (
          <section key={exercise.id} className="panel panel--soft smart-plan-exercise-card">
            <h4>{exercise.name}</h4>
            <div className="smart-plan-exercise-metrics">
              <span>Saetze/Wdh: {renderReps(exercise)}</span>
              <span>Ziel-RPE: {exercise.targetRpe}</span>
              <span>
                Gewicht: {exercise.estimatedWeight ? `${exercise.estimatedWeight} kg` : "RPE-basiert waehlen"}
              </span>
            </div>
            <p className="page-copy">{exercise.rationale}</p>
            <p className="form-feedback">{describeWeightReason(exercise)}</p>
          </section>
        ))}
      </div>

      <WorkoutFeedback
        plannedRpeDefault={getPlannedRpe(day)}
        storedFeedback={storedFeedback}
        onSubmit={(feedbackPayload) => onFeedbackSubmit({ weekNumber, dayId: day.id, feedbackPayload })}
      />
    </article>
  );
}
