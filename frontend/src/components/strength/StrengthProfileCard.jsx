import { useEffect, useMemo, useState } from "react";
import { LIFT_KEYS, LIFT_LABELS, parseDecimalInput } from "../../lib/strengthCalculations";

const experienceOptions = ["Einsteiger", "Fortgeschritten", "Wettkampfathlet"];
const goalOptions = ["Kraftaufbau", "Muskelaufbau", "Wettkampfvorbereitung"];

function mapProfileToForm(profile) {
  return {
    bodyweight: profile.bodyweight ?? "",
    experienceLevel: profile.experienceLevel ?? "",
    goal: profile.goal ?? "",
    nextCompetition: profile.nextCompetition ?? "",
    notes: profile.notes ?? "",
    squat: profile.lifts?.squat?.oneRepMax ?? "",
    bench: profile.lifts?.bench?.oneRepMax ?? "",
    deadlift: profile.lifts?.deadlift?.oneRepMax ?? "",
  };
}

export function StrengthProfileCard({ profile, onSave }) {
  const [form, setForm] = useState(() => mapProfileToForm(profile));
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(mapProfileToForm(profile)), [form, profile]);

  useEffect(() => {
    if (!isDirty) {
      setForm(mapProfileToForm(profile));
    }
  }, [isDirty, profile]);

  const handleFieldChange = (fieldName, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const updatedLifts = {};

    for (const liftKey of LIFT_KEYS) {
      const parsedOneRepMax = parseDecimalInput(form[liftKey]);

      if (parsedOneRepMax !== null && parsedOneRepMax <= 0) {
        setError(`${LIFT_LABELS[liftKey]} muss groesser als 0 sein.`);
        return;
      }

      if (parsedOneRepMax !== null) {
        updatedLifts[liftKey] = parsedOneRepMax;
      }
    }

    const nextFields = {
      bodyweight: form.bodyweight,
      experienceLevel: form.experienceLevel,
      goal: form.goal,
      nextCompetition: form.nextCompetition,
      notes: form.notes,
    };

    onSave({ fields: nextFields, lifts: updatedLifts });
    setStatus("saved");
  };

  return (
    <section className="panel page-stack" aria-labelledby="strength-profile-form">
      <div className="page-section-head">
        <p className="section-kicker">Strength Profil</p>
        <h2 id="strength-profile-form">Zentrale Datenbasis fuer dein Training</h2>
      </div>

      <form className="page-stack" onSubmit={handleSubmit}>
        <div className="card-grid">
          <label className="form-field">
            <span>Koerpergewicht (kg)</span>
            <input
              type="text"
              placeholder="z. B. 93"
              value={form.bodyweight}
              onChange={(event) => handleFieldChange("bodyweight", event.target.value)}
            />
          </label>

          <label className="form-field">
            <span>Erfahrungslevel</span>
            <select
              value={form.experienceLevel}
              onChange={(event) => handleFieldChange("experienceLevel", event.target.value)}
            >
              <option value="">Bitte auswaehlen</option>
              {experienceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Ziel</span>
            <select value={form.goal} onChange={(event) => handleFieldChange("goal", event.target.value)}>
              <option value="">Bitte auswaehlen</option>
              {goalOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Naechster Wettkampf (optional)</span>
            <input
              type="date"
              value={form.nextCompetition}
              onChange={(event) => handleFieldChange("nextCompetition", event.target.value)}
            />
          </label>
        </div>

        <div className="card-grid">
          {LIFT_KEYS.map((liftKey) => (
            <label className="form-field" key={liftKey}>
              <span>{LIFT_LABELS[liftKey]} 1RM (kg)</span>
              <input
                type="text"
                placeholder="z. B. 180"
                value={form[liftKey]}
                onChange={(event) => handleFieldChange(liftKey, event.target.value)}
              />
            </label>
          ))}
        </div>

        <label className="form-field">
          <span>Aktuelle Schwaechen / Notizen (optional)</span>
          <textarea
            className="strength-notes"
            placeholder="z. B. Bench off chest, Squat Tiefe in Week 3 instabil"
            value={form.notes}
            onChange={(event) => handleFieldChange("notes", event.target.value)}
          />
        </label>

        <div className="action-row">
          <button type="submit" className="button button--primary" disabled={!isDirty}>
            Strength Profil speichern
          </button>
          {status === "saved" ? <span className="status-pill">Gespeichert</span> : null}
        </div>

        {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}
      </form>
    </section>
  );
}
