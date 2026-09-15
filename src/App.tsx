import { Desktop } from "./os/Desktop";
import { OSProvider } from "./os/OSContext";

export default function App() {
  return (
    <OSProvider>
      <Desktop />
    </OSProvider>
  );
}
