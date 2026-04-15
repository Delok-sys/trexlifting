import { calculateMeetAttemptPlan } from "./meetAttemptPlanner";
import { MeetAttemptPlannerPanel } from "./MeetAttemptPlannerPanel";

export function MeetAttemptPlannerContainer({ storedLifts }) {
  const calculation = calculateMeetAttemptPlan(storedLifts);

  return <MeetAttemptPlannerPanel calculation={calculation} />;
}
