import moment from 'moment';
import React, { useEffect, useState } from 'react'

export const PostProfile = ({ user, timestamp }) =>
{
  const [date, setDate] = useState();

  useEffect(()=>
  {
    if(timestamp)
      setDate(moment(timestamp.toDate()).format("MMMM Do YYYY, h:mm:ss"));
    else setDate("")
  },[timestamp])

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
