import { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../../context/auth-context";

import './NavLinks.css';

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>All Users</NavLink>
      </li>
      {auth.token && (
        <>
          <li>
            <NavLink to={`/${auth.userId}/places`}>My places</NavLink>
          </li>
          <li>
            <NavLink to="/places/new">New place</NavLink>
          </li>
          <li>
            <button onClick={auth.logout}>Logout</button>
          </li>
        </>

      )}
      {!auth.token && (
        <li>
          <NavLink to="/login">Authenticate</NavLink>
        </li>
      )}
    </ul>
  )
}

export default NavLinks
