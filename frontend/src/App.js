import {useState, useCallback} from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import Users from "./user/pages/Users";
import Auth from "./user/pages/Auth";
import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";

import "./App.css";

function App() {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, []);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path="/places/new" exact>
          <NewPlace/>
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace/>
        </Route>
        <Redirect to="/"/>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path="/login" exact>
          <Auth />
        </Route>
        <Redirect to="/login"/>
      </Switch>
    );
  }

  return (
      <AuthContext.Provider value={{
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}>
        <Router>
          <MainNavigation />
          <main>
            {routes}
          </main>
        </Router>
      </AuthContext.Provider>
  );
}

export default App;
