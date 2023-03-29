import MDEditor from '@uiw/react-md-editor';
import React, { useEffect, useState } from 'react'
import { useFirebase } from './Hooks/useFirebase'
import { PostProfile } from './PostProfile'
import moment from 'moment';

export const Comment = ({ commentData }) =>
{
  const { state } = useFirebase(null, commentData.commentAuthor, null);

  return (

    <div className="comment">
      <PostProfile user={state.user} timestamp={commentData.timestamp} />
      <div className='post-post'>
        <MDEditor.Markdown
          source={commentData.comment}
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>
    </div>
  );
}
