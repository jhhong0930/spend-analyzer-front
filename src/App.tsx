import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CommonDataProvider } from "./data/DataTypeMaps";
import RecordPage from "./pages/RecordPage";
import SideMenu from "./pages/SideMenu";
import CardPage from "./pages/CardPage";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <Router>
      <CommonDataProvider>
        <div className="outer">
          <div className="side-menu">
            <SideMenu />
          </div>
          <div className="record-page">
            <Switch>
              <Route exact path="/">
                <MainPage />
              </Route>
              <Route exact path="/card">
                <CardPage />
              </Route>
              <Route exact path="/record">
                <RecordPage />
              </Route>
            </Switch>
          </div>
        </div>
      </CommonDataProvider>
    </Router>
  );
}

export default App;
