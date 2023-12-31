import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PrivateRoute from "./routing/PrivateRoute";

//Pages
import MainPage from "./components/pages/MainPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
import NewClientPage from "./components/pages/NewClientPage";
import UserPage from "./components/pages/UserPage";
import ClientsPage from "./components/pages/ClientsPage";
import UpdateClientPage from "./components/pages/UpdateClientPage";
import ClientsEntriesPage from "./components/pages/ClientsEntriesPage";
import MembershipsPage from "./components/pages/MembershipsPage";
import MembershipsEntriesPage from "./components/pages/MembershipsEntriesPage";

import "./App.css";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/"><Redirect to="/login"/></Route>
          <PrivateRoute exact path="/user-content"  component={UserPage} />
          <PrivateRoute exact path="/main" component={MainPage}/>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register"  component={RegisterPage} />
          <Route exact path="/forgotpassword" component={ForgotPasswordPage} />
          <Route exact path="/resetpassword/:resetToken" component={ResetPasswordPage}/>
          <PrivateRoute exact path="/new"  component={NewClientPage} />
          <PrivateRoute exact path="/clients"  component={ClientsPage} />
          <PrivateRoute exact path="/read/:clientId" component={UpdateClientPage} />
          <PrivateRoute exact path="/entries" component={ClientsEntriesPage} />
          <PrivateRoute exact path="/memberships" component={MembershipsPage} />
          <PrivateRoute exact path="/memberships-entries" component={MembershipsEntriesPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
