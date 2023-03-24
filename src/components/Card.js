import React, { useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment';

export const Card = ({spaceData}) => {
  const [lastSeen, setlastSeen] = useState()

  useEffect(() => {
    if(spaceData.lastUpdate)
      setlastSeen(moment(spaceData.lastUpdate.toDate()).fromNow())
    else
      setlastSeen("N/a")
  }, [spaceData])
  
  return (
    <div className="card">
      <img src={spaceData.url} className="card-thumbnail" />
      <div  className="card-bottom-section">
        <div className="card-details">
          <i className="fa fa-book-open-reader card-logo"></i>
          <h2 className="card-title">{spaceData.title}</h2>
          <div className="dtl members">
            <i className="fa fa-users"></i>
            <p>Members: {spaceData.members}</p>
          </div>
          <div className="dtl last-update">
            <i className="fa-regular fa-clock"></i>
            <p>Last update: {lastSeen}</p>
          </div>
          <Link style={{width:"100%"}} to={{pathname: `/learningspace/${spaceData.id}`}}>
            <button className="card-btn">Join</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
