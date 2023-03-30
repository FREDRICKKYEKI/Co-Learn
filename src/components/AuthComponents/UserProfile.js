import React,{useEffect, useState, useRef} from 'react'
import '../styles/profile.css'
import "react-tagsinput/react-tagsinput.css";
import TagsInput from 'react-tagsinput';
import {useFirebase} from '../Hooks/useFirebase'
import { useAuth } from '../Contexts/AuthProvider';
import { LoadingScreen } from '../LoadingScreen';
import { useNavigate, useParams } from 'react-router-dom';

export const UserProfile = () => 
{
  const defaultProfile = "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-68594.png?f=avif&w=256";
  const inputTagRef = useRef();
  const params = useParams();
  const { state } = useFirebase(null, params.userid)
  const [inputTags, setTags] = useState({ tags: [] });
  const userData = state.user;
  const { currentUser } = useAuth();
  const navigate = useNavigate()
  

  
  useEffect(() => 
  {
    if(!userData.interests) 
      return;
    else
      setTags(userData.interests)
  }, [userData.interests])

  useEffect(() => {
    if (!currentUser) return
    if (userData&&currentUser.uid == userData.id)
      navigate("/profile")
  }, [])
  
  
  return (
    <>
      {state.loading ? (
        <LoadingScreen />
      ) : (
        <div className="profile-div">
          <div className="header">
            <h1>Profile</h1>
          </div>
          <div className="body">
            <div className="bio">
              <div className="inner-div">
                <h3>Biography:</h3>
                <p>{userData.bio ? userData.bio : <i className="i">...</i>}</p>
              </div>
            </div>
            <div className="profilepic-div">
              <div className="profile-inner">
                <img
                  className="profilepic"
                  src={`${userData.url ? userData.url : defaultProfile}`}
                  alt="pic"
                />
              </div>
            </div>
            <div className="details">
              <div className="inner-div">
                <h3>Name:</h3>
                <p>
                  {userData.names &&
                    userData.names.firstName + " " + userData.names.secondName}
                </p>
                <h3>Country:</h3>
                <p>
                  {userData.country ? (
                    userData.country.label
                  ) : (
                    <i className="i">...</i>
                  )}
                </p>
                <h3>Email:</h3>
                <p>{userData.email}</p>
              </div>
              <div className="interests">
                <h3>
                  Interests: <span className="i"></span>
                </h3>
                <div className="taginput">
                  <TagsInput
                    className="tagclass tag-no-input"
                    ref={inputTagRef}
                    value={inputTags.tags}
                    focusedClassName="tagclass"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
