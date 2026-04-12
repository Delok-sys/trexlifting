export function TrainingWeightModulePanel({
  instanceId,
  moduleInput,
  calculation,
  liftOptionGroups,
  repOptions,
  rirOptions,
  onModuleInputChange,
}) {
  return (
    <div className="page-stack page-stack--sm">
      <div className="tools-module-grid">
        <label className="form-field">
          <span>Übung</span>
          <select
            value={moduleInput?.selectedLift ?? ""}
            onChange={(event) => onModuleInputChange(instanceId, "selectedLift", event.target.value)}
          >
            <option value="">Variation</option>
            {liftOptionGroups.map((group) => (
              <optgroup key={group.baseLiftKey} label={group.baseLiftLabel}>
                {group.options.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Reps</span>
          <select
            value={moduleInput?.reps ?? "5"}
            onChange={(event) => onModuleInputChange(instanceId, "reps", event.target.value)}
          >
            {repOptions.map((rep) => (
              <option key={rep} value={rep}>
                {rep}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>RIR</span>
          <select
            value={moduleInput?.rir ?? "2"}
            onChange={(event) => onModuleInputChange(instanceId, "rir", event.target.value)}
          >
            {rirOptions.map((rirOption) => (
              <option key={rirOption} value={rirOption}>
                {rirOption}
              </option>
            ))}
          </select>
        </label>
      </div>

      {calculation ? (
        calculation.status === "ready" ? (
          <div className="tools-module-result">
            <div className="result-panel">
              <span>Empfohlene Spanne</span>
              <strong>
                {calculation.formattedMinWeight} - {calculation.formattedMaxWeight} kg
              </strong>
            </div>
          </div>
        ) : (
          <p className="form-feedback form-feedback--error">{calculation.message}</p>
        )
      ) : (
        <p className="tools-module-copy">
          Waehle eine Variation, Wiederholungen und RIR. Das Modul nutzt dein gespeichertes 1RM
          als Grundlage.
        </p>
      )}
    </div>
  );
}
