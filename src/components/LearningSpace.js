import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from './Contexts/AuthProvider'
import { useFirebase } from './Hooks/useFirebase'
import { Posts } from './Posts'
import { Prerequisites } from './Prerequisites'
import { RelatedSpaces } from './RelatedSpaces'
import './styles/home.css'
import { Users } from './Users'
import { uuidv4 } from '@firebase/util';
import { database, db, db2 } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { LoadingScreen } from './LoadingScreen'


export const LearningSpace = () =>
{
    const navigate = useNavigate();
    const { spaceId } = useParams();
    const { currentUser } = useAuth();
    const [joined, setJoined] = useState();
    const [loading, setLoading] = useState()
    const { state } = useFirebase(spaceId, null);
    const data = state.space;
    const posts = state.posts;
    var btnText = currentUser?joined?"Leave":"Join":"Sign up join";
    const isAdmin = currentUser?data.admin == currentUser.uid:false;
    const members = data.members;
    var users = data.users;
    

    const joinSpace = (e) => 
    {
        e.stopPropagation();
        if (!currentUser) 
        navigate('/signup')
        else if(!isAdmin)
        {
            setJoined(!joined)
            handleJoinLeave()
        }
        else
            alert("⚠ Admin cannot leave learning space!")
    }
    
    const handleJoinLeave = () =>
    {
        setLoading(true)
        if(members<0)
        {
            alert("Oops. Something went wrong. Please try again after reload.");
            window.location.reload();
            return;
        }
        if(users.includes(currentUser.uid))
        {
            const newUsers = users.filter(user => user != currentUser.uid);
            const newMembers = newUsers.length;
            
            updateDoc(doc(db2, "learning_spaces", data.id),
            {
                members: newMembers,
                users: newUsers
            })
            .then(() =>
            {
                setLoading(false);
                alert("🏃🏼‍♂️You have succesfully left this learning space.");
                window.location.reload();
            })
            .catch(e=>console.log(e));
        }
        else
        {
            users.push(currentUser.uid);
            updateDoc(doc(db2, "learning_spaces", data.id),
            {
                members: users.length,
                users: users
            })
            .then(() => 
            {
                setLoading(false);
                alert("👍🏼You have joined successfully.");
                window.location.reload();
            })
            .catch(e=>console.log(e));

        }
    }

    useEffect(() => 
    {
        if(!currentUser) return;
        if(isAdmin)
            setJoined(true)
        else
        {
            if(data&&data.users.includes(currentUser.uid)) setJoined(true);
            else setJoined(false);
        }
    }, [data])

    return (
      <>
        {data && state.loading ? (
          <LoadingScreen />
        ) : (
          <div className="container">
            <header className="heading">
              <Link className="back-btn" to="/">
                <i className="fa fa-arrow-circle-left fa-2x " />
              </Link>
              <h1>{data.title}</h1>
              <button
                disabled={isAdmin}
                style={{
                  backgroundColor: joined && "var(--secondary)",
                  color: joined && "white",
                }}
                onClick={(e) => joinSpace(e)}
                className="join-leave-btn"
              >
                {loading?<i className="fa fa-spinner fa-spin" style={{fontSize:"24px"}}></i>:<>{btnText}</>}
              </button>
              {isAdmin && <div className="admin-mark"></div>}
            </header>
            <main className="ls-body">
              <Prerequisites spaceData={data} />
              <Posts spaceData={data} posts={posts} isAdmin={isAdmin} />
              <Users spaceData={data} />
            </main>
            <RelatedSpaces />
          </div>
        )}
      </>
    );
}
