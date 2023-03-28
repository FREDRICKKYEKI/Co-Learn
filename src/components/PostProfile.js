import React from 'react'

export const PostProfile = ({ user, date }) => {
  return (
    <>
      {user && (
        <div className="post-prof-pic">
          <img src={user.url} alt="profile-picture" />
          <div className="post-user-details">
            <h5>{user.names.firstName + " " + user.names.secondName}</h5>
            <div className="post-date">{date}</div>
          </div>
        </div>
      )}
    </>
  );
}
