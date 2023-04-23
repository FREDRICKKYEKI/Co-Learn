import { uuidv4 } from '@firebase/util';
import { deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import { useAuth } from './Contexts/AuthProvider';
import { useFirebase } from './Hooks/useFirebase';

export const PostFooter = ({ post, setOpenComments, OpenComments, comments }) => 
{
    const [postVotes, setPostVotes] = useState({Upvotes:0, Downvotes:0});
    const [open, setOpen] = useState(false);
    const { state } = useFirebase(null, null, post.id);
    const upvote = "u";
    const downvote = "d";
    const votes = state.votes;
    const map = new Map();
    const { currentUser } = useAuth();
    
    const getUserVote = () =>
    {
        if(!votes) return;
        if(!currentUser) return null;
        votes.forEach(obj => 
            {
                map.set(obj.userId, obj)
            });
            return map.get(currentUser.uid);
    }
        
    const upVote =getUserVote()?getUserVote().value == upvote: false;
    const downVote =getUserVote()?getUserVote().value == downvote: false;

    const getVotes = () =>
    {
        
        if(!votes) return;
        
        let ucount = 0;
        let dcount = 0;
        

        votes.map(vote =>
            {
                if(vote.value == upvote)
                {
                    ucount++;
                }
                else
                {
                    dcount++;
                }
            })
        setPostVotes({Upvotes: ucount, Downvotes: dcount})
    }


    const vote = async (v) =>
    {
      if (!currentUser)
      {
        alert("Oops😥, you are not joined. Please join the learning spaceto be able to contribute.");
      }
      const vote = getUserVote();
      const newId = uuidv4();
      switch (v)
      {
        case upvote:
            if(vote)
            {
                if(vote.value == upvote)
                {
                    await deleteDoc(database.vote(vote.id)).then(()=>
                    {
                    });
                }
                else if(vote.value == downvote) 
                {
                    updateDoc(database.vote(vote.id), { value: upvote })
                }
            }
            else
            {
                await setDoc(database.vote(newId),
                {
                    id: newId,
                    userId: currentUser.uid,
                    postId: post.id,
                    value: upvote

                },{ merge: true })
            }
        break;
        case downvote:
            if(vote)
            {
                if(vote.value == downvote)
                {
                    await deleteDoc(database.vote(vote.id))
                }
                else if (vote.value == upvote)
                {
                    updateDoc(database.vote(vote.id), { value: downvote })
                }
            }
            else
            {
                await setDoc(database.vote(newId),
                {
                    id: newId,
                    userId: currentUser.uid,
                    postId: post.id,
                    value: downvote
                })
            }
        break;
        default: return;
    }
  }

    useEffect(() => {
        getVotes();
    }, [votes])
    
  return (
    <div className="comment-footer">
      <div className="vote">
        <button onClick={() => vote("u")} className="v-btn">
          <i
            title="Up-Vote"
            className={`fal fa-lg fa-up icon ${upVote&&`voted`}`}
          ></i>
          <span style={{ fontSize: "14px" }} className="count">
            {postVotes.Upvotes}
          </span>
        </button>
        <div className="v-divide" />
        <button onClick={() => vote("d")} className="v-btn">
          <i
            title="Down-Vote"
            className={`fal fa-lg fa-down icon ${downVote && "voted"} `}
          ></i>
        </button>
      </div>
      <div className="footer-comment">
        <span onClick={() => setOpenComments(!OpenComments)} className="v-btn">
          <i className="far fa-lg fa-comment-dots icon"></i>
          <span style={{ fontSize: "14px" }} className="count">
            {comments?comments.length:"0"}
          </span>
        </span>
        <span
          onClick={(e) => {
            setOpen(!open);
          }}
          className="option-cont">
          <i className="fa-solid fa-lg fa-ellipsis icon"></i>
          {open && (
            <span className="pop-up">
            <div className='opt-delete'>
              <i className="fa fa-trash" />
              <strong>Delete</strong>
            </div>
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
