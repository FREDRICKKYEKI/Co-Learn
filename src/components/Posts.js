import React, { useRef, useState } from 'react'
import { Post } from './Post'
import MDEditor from '@uiw/react-md-editor';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db2 } from '../firebase';
import { uuidv4 } from '@firebase/util';
import { useAuth } from './Contexts/AuthProvider';
import { NoPosts } from './NoPosts';

export const Posts = ({spaceData, posts, isAdmin}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Post something...");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const postRef = useRef();
  const spaceId = spaceData.id;


  const handleSubmitForm = async (e) => 
  {
    e.preventDefault();
    if(!currentUser)
    {
      alert("Oops😥, you are not Signed In. Please sign in to be able to contribute in the learning space.");
      return;
    }
    else
    {
      const userId = currentUser.uid;
      const postId = uuidv4();

      if(!open)
        setOpen(true)
      else
      {
        setLoading(true)
        await setDoc(doc(db2, "posts", postId),
        {
          id: postId,
          spaceId: spaceId,
          postText: value,
          author: userId,
          timestamp: serverTimestamp()
        },
        {merge: "true"})
        .then(() =>
        {
          alert("Admin: Thank you for the contribution🤝🏼🤝🏼🤝🏼");
          setValue("");
          setOpen(false);
          window.scrollTo({top:"40",left:"0",behavior:"smooth"});
          postRef.current.scrollTo(0, 0);
        })
        .catch(() =>
        {
          setLoading(false);
          alert("Ooops😥, something went wrong, please try again.")
        });
        await updateDoc(doc(db2, "learning_spaces", spaceId),
        {
          lastUpdate: serverTimestamp()
        })
        .catch(() =>
        {
          setLoading(false);
          alert("Ooops😥, something went wrong, please try again.")
        })
        setLoading(false)
      }
    }
  }

  return (
    <div className="posts-container">
      <h3>Posts({posts.length})</h3>
      <div ref={postRef} className="posts">
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <Post key={post.id} post={post} isAdmin={isAdmin}/>
            ))}
          </>
        ) : (
          <NoPosts />
        )}
      </div>
      <form className="post-div" onSubmit={(e) => handleSubmitForm(e)}>
        {open && (
          <div data-color-mode="light">
            <MDEditor
              height={200}
              value={value}
              style={{ marginTop: "1.5rem" }}
              onChange={setValue}
            />
          </div>
        )}
        <div className="d-flex j-c pd">
          <button
            disabled={loading}
            type={`${open && "submit"}`}
            className={`create-post-btn ${open && "bg"}`}
          >
            {open ? (
              <>
                <i className="fa fa-plus-circle mr-2" />
                {loading ? (
                  <i
                    className="fa fa-spinner fa-spin"
                    style={{ fontSize: "24px" }}
                  ></i>
                ) : (
                  <>Post</>
                )}
              </>
            ) : (
              "+ Create Post"
            )}
          </button>
          {open && (
            <div onClick={() => setOpen(false)}>
              <i className="fa fa-angle-up fa-lg paperclip" />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}