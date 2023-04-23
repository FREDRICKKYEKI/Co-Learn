import React, { useEffect } from 'react'
import { useSpaceContext } from './LearningSpace';

export const Highlight = ({ userObj, highlightObj, forSide, setOpen }) =>
{
  const { active, modalValue, setHighlights, setValue, highlights } = useSpaceContext();

  const handleChange = (value) => { setValue(value) }

  const updatedHLightArr = highlights.map((hlight) =>
  {
    if(highlights&&active&&modalValue)
    {
      if (hlight.text == active)
        return { ...hlight, annot: modalValue };
      return hlight;
    }
  });
  
  return (
    <>
      {userObj && (
        <div className={`highlight-container ${!forSide&&"no-shadow"}`}>
          <div className="post-prof"> 
            <img className="prof-img" src={`${userObj.url}`} />
            <div className="side-user-details">
              <strong>{userObj.names.firstName+' '+userObj.names.secondName}</strong>
            </div>
          </div>
          <div className="hl">
            <p style={{fontWeight:"bold"}}>
                <mark>...{forSide ? highlightObj.text : active}...</mark>
            </p>
          </div>
          <div>
            <div className="annot">
            {!forSide ?
              <textarea value={modalValue} maxLength='400' onChange={(e) => handleChange(e.target.value)} placeholder="What's on your mind ?" />
              :
              <div className='annot-text'>{highlightObj.annot}</div>
            }
            </div>
          </div>
          {!forSide &&
            <button disabled={!modalValue} onClick={() => {setHighlights(updatedHLightArr); setOpen(false); setValue("")} } style={{marginInline:"auto", width:"40%", minWidth:"max-content"}} className='submitBtn'>Add</button>
          }
        </div>
      )}
    </>
  );
}
