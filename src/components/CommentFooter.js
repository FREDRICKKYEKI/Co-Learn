import React, { useState } from 'react';


export const CommentFooter = () => {
    const [open, setOpen] = useState(false)

  return (
    <div className="comment-footer">
      <div className="vote">
        <div className='v-btn'>
            <i title='Up-Vote' className="fal fa-lg fa-up"></i>
            <span style={{fontSize:"14px"}} className="count">42</span>
        </div>
        <div className='v-divide'/>
        <div className='v-btn'>
            <i title='Down-Vote' className="fal fa-lg fa-down"></i>
        </div>
      </div>
      <div className="comment">
        <span className='v-btn'>
            <i className="far fa-lg fa-comment-dots"></i>
            <span style={{fontSize:"14px"}}  className="count">5</span>
        </span>
        <span onClick={(e) => {setOpen(!open)}} className='option-cont'>
            <i className="fa-solid fa-lg fa-ellipsis "></i>
            {open&&
            <span className='pop-up'>
                <i className='fa fa-trash'/>
                <strong>Delete</strong>
            </span>
            }
        </span>
      </div>
    </div>
  );
}
