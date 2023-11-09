import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PrivateRoute from "./routing/PrivateRoute";
//Pages
import PrivatePage from "./components/pages/PrivatePage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
import NewClientPage from "./components/pages/NewClientPage";
import UserPage from "./components/pages/UserPage";
import ClientsPage from "./components/pages/ClientsPage";
import UpdateClientPage from "./components/pages/UpdateClientPage";
import ClientsEntriesPage from "./components/pages/ClientsEntriesPage";

import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/user-content"  component={UserPage} />
          <PrivateRoute  exact path="/main"component={PrivatePage}/>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register"  component={RegisterPage} />
          <Route exact path="/forgotpassword" component={ForgotPasswordPage} />
          <Route exact path="/resetpassword/:resetToken" component={ResetPasswordPage}/>
          <PrivateRoute exact path="/new"  component={NewClientPage} />
          <PrivateRoute exact path="/clients"  component={ClientsPage} />
          <PrivateRoute path="/read/:clientId" component={UpdateClientPage} />
          <PrivateRoute path="/entries" component={ClientsEntriesPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
