import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import Users from "./user/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
// import Auth from "./user/pages/Auth";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

import "./App.css";

const Auth = lazy(() => import('./user/pages/Auth'));
const NewPlace = lazy(() => import('./places/pages/NewPlace'));
const UpdatePlace = lazy(() => import('./places/pages/UpdatePlace'));
const UserPlaces = lazy(() => import('./places/pages/UserPlaces'));

function App() {
  const { token, login, logout, userId } = useAuth();

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
            <Suspense fallback={
              <div className="center"><LoadingSpinner /></div>
            }>
              {routes}
            </Suspense>
          </main>
        </Router>
      </AuthContext.Provider>
  );
}

export default App;
