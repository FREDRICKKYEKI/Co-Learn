import { async } from '@firebase/util'
import MDEditor from '@uiw/react-md-editor'
import { serverTimestamp, setDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { database } from '../firebase'
import { Modal } from './Modal'
import { uuidv4 } from '@firebase/util'
import { useAuth } from './Contexts/AuthProvider'
import { PostProfile } from './PostProfile'
import { useSpaceContext } from './LearningSpace'

export const AddCommentModal = ({ open, setOpen, postAuthor, postData }) =>
{
    const { currentUser } = useAuth();
    const [value, setValue] = useState();
    const [loading, setLoading] = useState(false);
    const { user } = useSpaceContext();

    
    useEffect(() => { return () => setLoading(false); },[open])
    
    const handleAddComment = async () =>
    {
      if (!currentUser)
      {
        alert("Oops😥, you are not joined. Please join the learning spaceto be able to contribute.");
        return;
      }
      setLoading(true);
      const commentId = uuidv4();
      await setDoc(database.comment(commentId),
      {
        id: commentId,
        commentAuthor: currentUser.uid,
        postId: postData.id,
        comment: value,
        timestamp: serverTimestamp()
      },
      {merge: true})
      .then(() =>
      {
          setOpen(false);
          setLoading(false);
          alert("✔ Comment successfully added.");
      })
      .catch(() =>
      {
          setOpen(false);
          setLoading(false);
          alert("Oops😥, Something went wrong. Please try again");
      })
    }

  return (
    <Modal open={open} setOpen={setOpen}>
      {postAuthor && (
        <>
          <div className="post-snapshot">
            <PostProfile user={postAuthor} timestamp={postData.timestamp} />
            <MDEditor.Markdown
              className='post-post'
              source={postData.postText}
              style={{ whiteSpace: "pre-wrap", height:"100%", margin:".5rem"}}
              />
          </div>
          <h3>
            Responding to
            <Link
              style={{ marginLeft: "5px", color: "var(--primary)" }}
              to={{ pathname: `/user/${postAuthor.id}`, state: { postAuthor } }}
            >
              {postAuthor.names.firstName}'s
            </Link>{" "}
            post
          </h3>
          <div className='w-100'>
            <PostProfile user={user} timestamp={null}/>
          </div>
          <div data-color-mode="light">
            <MDEditor
              placeholder='Add comment...'
              height={200}
              value={value}
              style={{ marginTop: "1.5rem"}}
              onChange={setValue}
            />
          </div>
          <button
            disabled={!value&&!currentUser}
            onClick={() => handleAddComment()}
            style={{ width: "max-content" }}
            className="submitBtn"
          >
            {loading ? (
              <i
                style={{ fontSize: "24px" }}
                className="fa fa-spinner fa-spin"
              />
            ) : (
              "Add Comment"
            )}
          </button>
        </>
      )}
    </Modal>
  );
}
