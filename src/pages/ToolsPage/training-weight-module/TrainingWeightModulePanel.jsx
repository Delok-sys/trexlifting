export function TrainingWeightModulePanel({
  rows,
  liftOptionGroups,
  repOptions,
  rirOptions,
  onModuleInputChange,
  onModuleRowAdd,
  onModuleRowRemove,
}) {
  return (
    <div className="page-stack page-stack--sm">
      <div className="tools-module-rows">
        {rows.map((row, index) => (
          <div key={row.id} className="tools-module-row panel panel--soft">
            <div className="tools-module-grid">
              <label className="form-field">
                <span>Uebung</span>
                <select
                  value={row.selectedLift ?? ""}
                  onChange={(event) =>
                    onModuleInputChange("training-weight-range", row.id, {
                      fieldName: "selectedLift",
                      fieldValue: event.target.value,
                    })
                  }
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
                  value={row.reps ?? "5"}
                  onChange={(event) =>
                    onModuleInputChange("training-weight-range", row.id, {
                      fieldName: "reps",
                      fieldValue: event.target.value,
                    })
                  }
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
                  value={row.rir ?? "2"}
                  onChange={(event) =>
                    onModuleInputChange("training-weight-range", row.id, {
                      fieldName: "rir",
                      fieldValue: event.target.value,
                    })
                  }
                >
                  {rirOptions.map((rirOption) => (
                    <option key={rirOption} value={rirOption}>
                      {rirOption}
                    </option>
                  ))}
                </select>
              </label>

              <div className="tools-module-result tools-module-result--inline">
                {row.calculation ? (
                  row.calculation.status === "ready" ? (
                    <div className="tools-module-result-field" aria-live="polite">
                      <span>Empfohlenes Gewicht</span>
                      <strong>
                        {row.calculation.formattedMinWeight} - {row.calculation.formattedMaxWeight} kg
                      </strong>
                    </div>
                  ) : (
                    <p className="form-feedback form-feedback--error">{row.calculation.message}</p>
                  )
                ) : (
                  <p className="tools-module-copy">
                    
                  </p>
                )}
              </div>

              <div className="tools-module-row-actions">
                <button
                  type="button"
                  className="button tools-module-icon-button tools-module-icon-button--danger"
                  onClick={() => onModuleRowRemove("training-weight-range", row.id)}
                  disabled={rows.length === 1}
                  aria-label={`Zeile ${index + 1} entfernen`}
                >
                  &minus;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="action-row">
        <button
          type="button"
          className="button tools-module-icon-button tools-module-icon-button--add"
          onClick={() => onModuleRowAdd("training-weight-range")}
          aria-label="Neue Zeile hinzufuegen"
        >
          &#43;
        </button>
      </div>
    </div>
  );
}
