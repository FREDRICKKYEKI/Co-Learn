import React, { useEffect, useState, createContext, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from './Contexts/AuthProvider'
import { useFirebase } from './Hooks/useFirebase'
import { Posts } from './Posts'
import { Prerequisites } from './Prerequisites'
import { RelatedSpaces } from './RelatedSpaces'
import './styles/home.css'
import { Users } from './Users'
import { db2 } from '../firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { LoadingScreen } from './LoadingScreen'
import { SideModal } from './SideModal'
import './styles/space.css'

export const SpaceContext = createContext();

export function useSpaceContext() { return useContext(SpaceContext) }

export const LearningSpace = () =>
{
  const navigate = useNavigate();
  const { spaceId } = useParams();
  const { currentUser } = useAuth();
  const [joined, setJoined] = useState();
  const [loading, setLoading] = useState();
  const { state } = useFirebase(
    spaceId,
    currentUser ? currentUser.uid : null,
    null
  );
  const spaceData = state.space;
  const posts = state.posts;

  var btnText = currentUser ? (joined ? "Leave" : "Join") : "Sign up join";
  const isAdmin = currentUser ? spaceData.admin == currentUser.uid : false;
  const members = spaceData.members;
  var users = spaceData.users;
  const [openSideModal, setOpenModal] = useState(false);
  const [highlights, setHighlights] = useState([]);

  const joinSpace = (e) => {
    e.stopPropagation();
    if (!currentUser) navigate("/signup");
    else if (!isAdmin) {
      setJoined(!joined);
      handleJoinLeave();
    } else alert("⚠ Admin cannot leave learning space!");
  };

  const handleJoinLeave = () => {
    setLoading(true);
    if (members < 0) {
      alert("Oops. Something went wrong. Please try again after reload.");
      window.location.reload();
      return;
    }
    if (users.includes(currentUser.uid)) {
      const newUsers = users.filter((user) => user != currentUser.uid);
      const newMembers = newUsers.length;

      updateDoc(doc(db2, "learning_spaces", spaceData.id), {
        members: newMembers,
        users: newUsers,
      })
        .then(() => {
          setLoading(false);
          alert("🏃🏼‍♂️You have succesfully left this learning space.");
          window.location.reload();
        })
        .catch((e) => console.log(e));
    } else {
      users.push(currentUser.uid);
      updateDoc(doc(db2, "learning_spaces", spaceData.id), {
        members: users.length,
        users: users,
      })
        .then(() => {
          setLoading(false);
          alert("👍🏼You have joined successfully.");
          window.location.reload();
        })
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    if (isAdmin) setJoined(true);
    else {
      if (spaceData && spaceData.users.includes(currentUser.uid))
        setJoined(true);
      else setJoined(false);
    }
  }, [spaceData]);

  return (
    <>
      {spaceData ? (
        <SpaceContext.Provider
          value={{
            user: state.user && state.user,
            openSideModal,
            setOpenModal,
            highlights,
            setHighlights,
          }}
        >
          <div className="container">
            <header
              style={{ backgroundImage: `url(${spaceData.url})` }}
              className="heading"
            >
              <div className="header-bg">
                <Link className="back-btn" to="/">
                  <i className="fa fa-arrow-circle-left fa-2x " />
                </Link>
                <h1>{spaceData.title}</h1>
                <button
                  disabled={isAdmin}
                  style={{
                    backgroundColor: joined && "var(--secondary)",
                    color: joined && "white",
                  }}
                  onClick={(e) => joinSpace(e)}
                  className="join-leave-btn"
                >
                  {loading ? (
                    <i
                      className="fa fa-spinner fa-spin"
                      style={{ fontSize: "24px" }}
                    ></i>
                  ) : (
                    <>{btnText}</>
                  )}
                </button>
                {isAdmin && <div className="admin-mark">admin</div>}
              </div>
            </header>
            <main className="ls-body">
              <Prerequisites spaceData={spaceData} />
              <Posts spaceData={spaceData} posts={posts} />
              <Users spaceData={spaceData} />
            </main>
            <RelatedSpaces />
          </div>
          {openSideModal && (
            <SideModal open={openSideModal} setOpen={setOpenModal} />
          )}
        </SpaceContext.Provider>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}
