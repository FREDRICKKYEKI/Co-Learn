import React from 'react'
import { Link } from 'react-router-dom';
import { AdminMark } from './AdminMark';
import { useAuth } from './Contexts/AuthProvider';
import { useFirebase } from './Hooks/useFirebase'

export const User = ({ user, spaceData }) =>
{
  const { state } = useFirebase(null, user);
  const userData = state.user;
  const admin = spaceData.admin;
  const isAdmin = admin === user;
  const { currentUser } = useAuth()
  const isCurrent = currentUser ? user === currentUser.uid : false;
  const defaultProfile = "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-68594.png?f=avif&w=256";
  return (
    <>
      {userData && (
        <Link
          to={{ pathname: `/user/${user}`,
          state: { userData } }}
          className={`user-div br-12 ${isCurrent && "current-user"}`}
        >
          {isAdmin && <div className="admin-mark am-sm"></div>}
          <AdminMark isAdmin={isAdmin} sm />
          <div className="user-details">
            <>
              <img src={`${userData.url ? userData.url : defaultProfile}`} />
              <b>
                {userData.names.firstName + " " + userData.names.secondName}
              </b>
            </>
          </div>
        </Link>
      )}
    </>
  );
}
