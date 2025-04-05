import UsersItem from "../UsersItem";
import Card from "../../../shared/components/UIElements/Card";
import "./UsersList.css";

const UsersList = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found</h2>
        </Card>
      </div>
    )
  }

  const list = props.items.map( user => {
    return <UsersItem key={user.id} user={user} />
  });

  return (
    <>
      <Card>
        <h2>Users list</h2>
      </Card>
      <ul className="users-list">
        {list}
      </ul>
    </>
  )
}

export default UsersList;
