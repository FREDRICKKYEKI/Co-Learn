import React, { useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor';
import { useFirebase } from './Hooks/useFirebase';
import moment from 'moment';
import { PostFooter } from './PostFooter';
import { CommentSection } from './CommentSection';
import { PostProfile } from './PostProfile';
import { AdminMark } from './AdminMark';

export const Post = ({  post, spaceData }) => 
{
  const { state } = useFirebase(null, post.author, post.id);
  const [user, setUser] = useState();
  const [date, setDate] = useState()
  const admin = spaceData.admin;
  const isAdmin = admin === state.user.id;
  const [openComments, setOpenComments] = useState(false)
  const comments = state.comments;

  
  useEffect(() => 
  {
    setUser(state.user);
    
  }, [state.user])

  useEffect(()=>
  {
    if(post.timestamp)
      setDate(moment(post.timestamp.toDate()).format("MMMM Do YYYY, h:mm:ss"));

  },[post.timestamp])

  return (
    <>
      {state && user && (
        <>
          <div key={post.id} className="post-card">
            <AdminMark isAdmin={isAdmin} />
            <PostProfile user={user} date={date} />
            <div className="pd post-post">
              <MDEditor.Markdown
                source={post.postText}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </div>
            <PostFooter
              post={post}
              setOpenComments={setOpenComments}
              OpenComments={openComments}
              comments={comments}
            />
            {openComments && <CommentSection postAuthor={user} postData={post} comments={comments}/>}
          </div>
        </>
      )}
    </>
  );
}
