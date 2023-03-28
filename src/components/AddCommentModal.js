import { async } from '@firebase/util'
import MDEditor from '@uiw/react-md-editor'
import { serverTimestamp, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { database } from '../firebase'
import { Modal } from './Modal'
import { uuidv4 } from '@firebase/util'
import { useAuth } from './Contexts/AuthProvider'

export const AddCommentModal = ({ open, setOpen, postAuthor, postData }) =>
{
    const { currentUser } = useAuth();
    const [value, setValue] = useState("Add comment...");
    const [loading, setLoading] = useState(false)

    useEffect(() => {    return () => setLoading(false); }, [open])
    
    const handleAddComment = async () =>
    {
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
      <h3>
        Respond to
        <Link
          style={{ marginLeft:"5px", color: "var(--primary)" }}
          to={{ pathname: `/user/${postAuthor.id}`, state: { postAuthor } }}
        >
          {postAuthor.names.firstName}
        </Link>
      </h3>
      <div data-color-mode="light">
        <MDEditor
          height={200}
          value={value}
          style={{ marginTop: "1.5rem" }}
          onChange={setValue}
        />
      </div>
      <button disabled={loading} onClick={() => handleAddComment()} style={{ width: "max-content" }} className="submitBtn">
        {loading?<i style={{fontSize:"24px"}} className='fa fa-spinner fa-spin'/>:"Add Comment"}
      </button>
    </Modal>
  );
}
