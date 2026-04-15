export function MeetAttemptPlannerPanel({ calculation }) {
  const readyLifts = calculation.lifts.filter((lift) => lift.status === "ready");
  const unavailableLifts = calculation.lifts.filter((lift) => lift.status !== "ready");

  const attemptRows = [
    {
      id: "opener",
      title: "Opener",
      renderValue: (lift) => (
        <div className="tools-attempt-cell-card tools-attempt-cell-card--opener">
          <strong>{lift.openerRange.formatted}</strong>
        </div>
      ),
    },
    {
      id: "second",
      title: "2. Versuch",
      renderValue: (lift) => (
        <div className="tools-attempt-cell-stack">
          {lift.secondAttemptRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="tools-attempt-cell-card">
              <span>{recommendation.label}</span>
              <strong>{recommendation.range.formatted}</strong>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "third",
      title: "3. Versuch",
      renderValue: (lift) => (
        <div className="tools-attempt-cell-stack">
          {lift.thirdAttemptRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="tools-attempt-cell-card">
              <span>{recommendation.label}</span>
              <strong>{recommendation.target.formatted}</strong>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="page-stack page-stack--sm">
      <div className="tools-attempt-list">
        {readyLifts.length > 0 ? (
          <section className="tools-attempt-card tools-attempt-card--matrix panel panel--soft">
            <div
              className="tools-attempt-matrix"
              style={{ "--tools-attempt-columns": readyLifts.length }}
            >
              <div className="tools-attempt-matrix-head" aria-hidden="true" />
              {readyLifts.map((lift) => (
                <div key={lift.key} className="tools-attempt-lift-head">
                  <span className="eyebrow">Wettkampf Lift</span>
                  <h4>{lift.label}</h4>
                  <span className="status-pill">1RM {lift.oneRepMax} kg</span>
                </div>
              ))}

              {attemptRows.flatMap((row) => [
                <div key={`${row.id}-label`} className="tools-attempt-row-label">
                  <p className="tools-attempt-title">{row.title}</p>
                </div>,
                ...readyLifts.map((lift) => (
                  <div key={`${row.id}-${lift.key}`} className="tools-attempt-cell">
                    {row.renderValue(lift)}
                  </div>
                )),
              ])}
            </div>
          </section>
        ) : null}

        {unavailableLifts.map((lift) => (
          <section key={lift.key} className="tools-attempt-card panel panel--soft">
            <div className="tools-attempt-card-head">
              <div>
                <span className="eyebrow">Wettkampf Lift</span>
                <h4>{lift.label}</h4>
              </div>
            </div>
            <p className="form-feedback form-feedback--error">{lift.message}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
