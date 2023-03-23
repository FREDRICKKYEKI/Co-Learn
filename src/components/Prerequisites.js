import React from 'react'
import TagsInput from 'react-tagsinput'
import "react-tagsinput/react-tagsinput.css";

export const Prerequisites = ({spaceData}) => {
  const prereq = spaceData.prereq;
  const desc = spaceData.desc;

  return (
      <div className="preq">
        <h3>Prerequisites</h3>
        {prereq && (
          <TagsInput
            className="tagclass tag-no-input"
            value={prereq.tags}
            focusedClassName="tagclass"
            inputProps={{ placeholder: "" }}
            addKeys={[9, 13, 188]}
            removeKeys={[8]}
            disabled={true}
          />
        )}
        <div className='mt-2'>
          <h4>Description.</h4>
          <p>{desc}</p>
        </div>
      </div>
  );
}
