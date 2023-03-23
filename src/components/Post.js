import React, { useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor';
import { useFirebase } from './Hooks/useFirebase';
import moment from 'moment';

export const Post = ({  post, isAdmin }) => 
{
  const { state } = useFirebase(null, post.author);
  const [user, setUser] = useState();
  const [date, setDate] = useState()
 

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
      {state&&user&&(
        <>
          <div className="post-card">
          {isAdmin&&<div className='admin-mark am-sm'></div>}
            <div className="post-prof-pic">
              <img src={user.url} alt="profile-picture" />
              <div className="post-user-details">
                <h5>{user.names.firstName + " " + user.names.secondName}</h5>
                <div className="post-date">{date}</div>
              </div>
            </div>
            <div className="pd">
              <MDEditor.Markdown
                source={post.postText}
                style={{ whiteSpace: "pre-wrap"}}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
