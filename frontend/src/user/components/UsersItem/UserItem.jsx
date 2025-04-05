import Avatar from "../../../shared/components/UIElements/Avatar";
import Card from "../../../shared/components/UIElements/Card";

import { Link } from "react-router-dom";
import "./UserItem.css";

const UserItem = ( {user: {id, image, name, places: placeCount}}) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${id}/places`}>
          <div className="user-item__image">
            <Avatar image={`http://localhost:5000/${image}`} alt={name}/>
          </div>
          <div className="user-item__info">
            <h3>{name}</h3>
            <h3>{placeCount.length} {placeCount.length === 1 ? "Place" : "Places"}</h3>
          </div>
        </Link>
      </Card>
    </li>
  )
}

export default UserItem;
