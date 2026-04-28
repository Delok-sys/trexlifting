import { calculateAttemptRecommendations } from "../../../lib/strengthCalculations";

export const calculateMeetAttemptPlan = (storedLifts) => calculateAttemptRecommendations(storedLifts);
