import "../../styles/ToolsPage.css";
import { useStrengthProfile } from "../../context/StrengthProfileContext";
import { MeetAttemptPlannerContainer } from "../../pages/ToolsPage/meet-attempt-planner/MeetAttemptPlannerContainer";

export function AttemptSelector() {
  const { profile } = useStrengthProfile();

  return <MeetAttemptPlannerContainer storedLifts={profile.lifts} />;
}
