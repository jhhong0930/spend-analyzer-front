import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CommonDataProvider } from "./data/DataTypeMaps";
import RecordPage from "./pages/RecordPage";
import SideMenu from "./pages/SideMenu";

function App() {
  return (
    <CommonDataProvider>
      <div className="outer">
        <div className="side-menu">
          <SideMenu />
        </div>
        <div className="record-page">
          <RecordPage />
        </div>
      </div>
    </CommonDataProvider>
  );
}

export default App;
