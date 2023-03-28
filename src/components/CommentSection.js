import React, { useState } from 'react'
import { AddCommentModal } from './AddCommentModal';
import { Comment } from './Comment'
import { useFirebase } from './Hooks/useFirebase';
import './styles/comments.css'

export const CommentSection = ({ postData, comments, postAuthor }) =>
{
    const [open, setOpen] = useState(false);

  return (
    <div className={`comments-div ${!comments&&"no-comments"}`}>
      <div className="com-header d-flex">
        <div className='header-txt com-h'>
          <strong>Comments.</strong>
        </div>
        <div onClick={() => setOpen(!open)} title='Add comment' className="add-comment com-h">
          <i className="fa fa-comment-plus fa-xl" />
        </div>
      </div>

      {comments ? (
        <>
          {comments.map((comment) => (
            <Comment commentData={comment} />
          ))}
        </>
      ) : (
        <div className="d-flex j-c">
          <i>No comments</i>
        </div>
      )}
      <AddCommentModal open={open} setOpen={setOpen} postAuthor={postAuthor} postData={postData}/>
    </div>
  );
}
