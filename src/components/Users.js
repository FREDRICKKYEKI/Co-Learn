import React from 'react'
import { useAuth } from './Contexts/AuthProvider';
import { User } from './User'

export const Users = ({ spaceData }) => {
  const { currentUser } = useAuth()
  const users = spaceData.users;

  return (
    <div className="users ">
      {users && (
        <>
          <h3>Active Users({users.length})</h3>
          <div className="users-div">
            {users.map((user) => (
              <User key={user} user={user} spaceData={spaceData}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
