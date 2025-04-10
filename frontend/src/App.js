import {useState, useCallback, useEffect} from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import Users from "./user/pages/Users";
import Auth from "./user/pages/Auth";
import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";

import "./App.css";

let logoutTimer;

function App() {
  const [token, setToken] = useState(false);
  const [expirationDate, setExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);

    const tokenExpDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpirationDate(tokenExpDate);

    localStorage.setItem('userData', JSON.stringify({
      userId: uid,
      token: token,
      expiration: tokenExpDate.toISOString()
    }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && expirationDate) {
      const remainingTime = expirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
      console.log(remainingTime)
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, expirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date( storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date( storedData.expiration));
    }
  }, [login]);

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
