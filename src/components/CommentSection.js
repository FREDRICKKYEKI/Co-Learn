import React, { useState } from 'react'
import { AddCommentModal } from './AddCommentModal';
import { Comment } from './Comment'
import { useAuth } from './Contexts/AuthProvider';
import './styles/comments.css'

export const CommentSection = ({ postData, comments, postAuthor }) =>
{
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth()

  const openAddCommentsModal = () =>
  {
    if (!currentUser)
    {
      alert("Oops😥, you are not Signed In. Please sign in to be able to contribute in the learning space.");
      return;
    }
    else
      setOpen(!open)
  }

  return (
    <div className={`comments-div ${comments < 1 && "no-comments"}`}>
      <div className="com-header d-flex">
        <div className="header-txt com-h">
          <strong>Comments({comments.length})</strong>
        </div>
        <div
          onClick={() => openAddCommentsModal()}
          title="Add comment"
          className="add-comment com-h"
        >
          <i className="fa fa-comment-plus fa-xl" />
        </div>
      </div>
      <div className={`comms-area ${comments < 1 && "no-comments"}`}>
        {comments.length > 0 ? (
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
      </div>
      <AddCommentModal
        open={open}
        setOpen={setOpen}
        postAuthor={postAuthor}
        postData={postData}
      />
    </div>
  );
}
