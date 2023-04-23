import React, { useRef, useState } from 'react'
import { Post } from './Post'
import MDEditor from '@uiw/react-md-editor';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db2 } from '../firebase';
import { uuidv4 } from '@firebase/util';
import { useAuth } from './Contexts/AuthProvider';
import { NoPosts } from './NoPosts';
import { CreatePostBtn } from './CreatePostBtn';
import HighlightPop from 'react-highlight-pop';
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-serializer";
import rangy from "rangy";
import { useSpaceContext } from './LearningSpace';
import { HighlightModal } from './HighlightModal';

export const Posts = ({spaceData, posts}) =>
{
  rangy.init();
  const {openHighlightModal, setOpenHLModal, setOpenModal, highlights, setHighlights, active, setActive } = useSpaceContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Post something...");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const postRef = useRef();
  const spaceId = spaceData.id;
  const spaceMembers = spaceData.users;
  const isMember = currentUser?spaceMembers&&spaceMembers.includes(currentUser.uid):false;
  const [styles, setStyles] = useState({ color: "white" });
  var highlightsArr = [];
  

  const handleSubmitForm = async (e) => 
  {
    e.preventDefault();
    if(!currentUser)
    {
      alert("Oops😥, you are not Signed In. Please sign in to be able to contribute in the learning space.");
      return;
    }
    else if (!isMember)
    {
      alert("Oops😥, you are not joined. Please join the learning spaceto be able to contribute.");
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
  const onHighlightAction = () =>
  {
    const highlighter = rangy.createHighlighter();
    const id = uuidv4();
    const classApplier = rangy.createClassApplier("highlight", {
      tagNames: ["span"],
      elementAttributes: { id: id },
      onElementCreate: (element) => {
        element.addEventListener("click", onHighlightClick);
      }
    });
    highlighter.addClassApplier(classApplier);
    highlighter.highlightSelection("highlight");
    let selection = rangy.getSelection();
    const selTxt = selection.toString().trim();
    rangy.getSelection().removeAllRanges();
    setActive(selTxt)
    const highlightData = {
    id: id,
    text: selTxt.toString(),
    annot: ""
    };
    highlightsArr = highlights;
    highlightsArr.push(highlightData);
    setHighlights(highlightsArr);
    openModal()
  }
 
  const openModal = () =>
  {
    setOpenHLModal(true);
  }

  const onHighlightClick = (e) =>
  {
    e.stopPropagation();
    setOpenModal(true);
    setActive(e.target.innerText);
  };
  return (
    <div className="posts-container">
      <h3>Posts({posts.length})</h3>
      <div ref={postRef} className="posts">
        <HighlightPop
			className="highlight-div"
			popoverItems={(itemClass) => (
            <>
              <span className={itemClass} onClick={() => onHighlightAction()}>
                <i style={styles} className="fa fa-highlighter"></i>
              </span>
            </>
          )}
          onHighlightPop={() => setStyles({ color: "white" })}
        >
          {posts.length > 0 ? (
            <>
              {posts.map((post) => (
                  <Post key={post.id} post={post} spaceData={spaceData} />
              ))}
            </>
          ) : (
            <NoPosts />
          )}
        </HighlightPop>
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
          <CreatePostBtn open={open} loading={loading} />
          {open && (
            <div onClick={() => setOpen(false)}>
              <i className="fa fa-angle-up fa-lg paperclip" />
            </div>
          )}
        </div>
      </form>
      <HighlightModal open={openHighlightModal} setOpen={setOpenHLModal}/>
    </div>
  );
}
