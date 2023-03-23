import React,{useEffect, useState, useRef} from 'react'
import '../styles/profile.css'
import "react-tagsinput/react-tagsinput.css";
import TagsInput from 'react-tagsinput';
import { ProfileModal } from './ProfileModal';
import {useFirebase} from '../Hooks/useFirebase'
import { useAuth } from '../Contexts/AuthProvider';
import { LogOutModal } from './LogOutModal';
import { LoadingScreen } from '../LoadingScreen';
import { uuidv4 } from '@firebase/util';

const Profile = () => 
{
  const defaultProfile = "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-68594.png?f=avif&w=256"
  const inputTagRef = useRef()
  const {currentUser} = useAuth();
  const [open, setOpen] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)  
  const [inputTags, setTags] = useState({ tags: [] });
  const {state} = useFirebase(null, currentUser.uid);           
  
  const userData = state.user;
  
  useEffect(() => 
  {
    if(state.loading) return;
    document.body.style="background:white"
  }, [])
  
  
  useEffect(() => 
  {
    if(!userData.interests) 
    return;
    else
    setTags(userData.interests)
  }, [userData.interests])
  

  return (
    <>
      {state.loading ? (
        <LoadingScreen />
      ) : (
        <div className="profile-div">

          <div className="logout" onClick={() => setOpenLogout(true)}>
            <i className="fa fa-sign-out" aria-hidden="true"></i>
            <div>Log Out</div>
          </div>

          <div className="header">
            <h1>Profile</h1>
          </div>

          <div className="body">
            <div className="bio">
              <div className="inner-div">
                <h3>Biography:</h3>
                <p>{userData.bio?userData.bio:<i className='i'>...</i>}</p>
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
              <div
                title="Edit your profile details"
                onClick={() => setOpen(true)}
                className="editBtn"
              >
                Edit Profile
              </div>
            </div>

            <div className="details">
              <div className="inner-div">
                <h3>Name:</h3>
                <p>
                  {userData.names?userData.names.firstName + " " + userData.names.secondName:<i className='i'>...</i>}
                </p>
                <h3>Country:</h3>
                  <p>{userData.country?userData.country.label:<i className='i'>...</i>}</p>
                <h3>Email:</h3>
                <p>{currentUser.email}</p>
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
      <ProfileModal
        tags={inputTags}
        setTags={setTags}
        state={userData}
        open={open}
        setOpen={setOpen}
        inputTagRef={inputTagRef}
        defaultProfile={defaultProfile}
      />
      <LogOutModal open={openLogout} setOpen={setOpenLogout} />
    </>
  );
}

export default Profile;