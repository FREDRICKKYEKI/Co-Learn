import React from 'react'
import { Link } from 'react-router-dom'

export const Card = ({spaceData}) => {

  return (
    <div className="card">
      <img src={spaceData.url} className="card-thumbnail" />
      <div  className="card-bottom-section">
        <div className="card-details">
          <i className="fa fa-book-open-reader card-logo"></i>
          <h2 className="card-title">{spaceData.title}</h2>
          <div className="dtl members">
            <i className="fa fa-users"></i>
            <p>{spaceData.members}</p>
          </div>
          <div className="dtl last-update">
            <i className="fa-regular fa-clock"></i>
            <p>Last update: 9 days ago</p>
          </div>
          <Link style={{width:"100%"}} to={{pathname: `/learningspace/${spaceData.id}`}}>
            <button className="card-btn">Join</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
