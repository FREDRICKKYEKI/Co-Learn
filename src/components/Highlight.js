import React from 'react'

export const Highlight = ({ userObj, highlightObj, forSide }) =>
{
  return (
    <>
      {userObj && (
        <div className="highlight-container">
          <div className="post-prof">
            <img className="prof-img" src={`${userObj.url}`} />
            <div className="side-user-details">
              <strong>{userObj.names.firstName+' '+userObj.names.secondName}</strong>
            </div>
          </div>
          <div className="hl">
            <p>
                <mark>...{highlightObj.text}...</mark>
            </p>
          </div>
          <div>
            <div className="annot">
            {forSide ?
              <textarea maxLength='400' placeholder="What's on your mind ?" />
              :
              <div>{highlightObj.annot}</div>
            }
            </div>
          </div>
        </div>
      )}
    </>
  );
}
