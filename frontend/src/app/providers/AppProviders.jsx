import { Provider } from "react-redux";
import { StrengthProfileProvider } from "../../context/StrengthProfileContext";
import { TrainingPlanProvider } from "../../context/TrainingPlanContext";
import { store } from "../../store";

export function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <StrengthProfileProvider>
        <TrainingPlanProvider>{children}</TrainingPlanProvider>
      </StrengthProfileProvider>
    </Provider>
  );
}
