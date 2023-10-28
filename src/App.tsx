import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CommonDataProvider } from "./data/DataTypeMaps";
import RecordPage from "./pages/RecordPage";

function App() {
  return (
    <CommonDataProvider>
      <RecordPage />
    </CommonDataProvider>
  );
}

export default App;
