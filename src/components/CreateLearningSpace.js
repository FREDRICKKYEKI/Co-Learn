import React, { useState, useRef, useEffect } from 'react'
import { FileDrop } from 'react-file-drop';
import TagsInput from 'react-tagsinput'
import "react-tagsinput/react-tagsinput.css";
import { DragDropFile } from './DragDropFile';
import './styles/crlsp.css'
import './styles/profile.css'
import { ChooseImageModal } from './ChooseImageModal'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, db2, storage } from '../firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { uuidv4 } from '@firebase/util';
import { useAuth } from './Contexts/AuthProvider';
import { ErrorAlert } from './AuthComponents/ErrorAlert';
import { useNavigate } from 'react-router-dom';

export const CreateLearningSpace = () => 
{
  const formRef = useRef();
  const titleRef = useRef();
  const descRef = useRef();
  const inputRef = useRef();
  const errorRef = useRef();
  const [inputTags, setTags] = useState({ tags: [] });
  const [files, setFiles] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [imgUrl, setImgUrl] = useState();
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleTagChange = (tags) => setTags({ tags });

  const setData = (mode) =>
  {
    const title = titleRef.current.value;
    const desc = descRef.current.value;
    const spaceId = uuidv4();

    switch (mode)
    {
      case 1:
        const userStorageRef = ref(storage, `/spaces-thumbnails/${title}`);
        const uploadTask = uploadBytesResumable(userStorageRef, files)
        uploadTask.on("state_changed",
        () => {},
        () => {  setError("Error!")  },
        () =>
        {
          getDownloadURL(uploadTask.snapshot.ref).then(url =>
          {
            setDoc(doc(db2,"learning_spaces", spaceId),
            {
              id: spaceId,
              admin: currentUser.uid,
              members: 1,
              title: title,
              desc: desc,
              prereq: inputTags,
              url : url,
              timestamp: serverTimestamp(),
              users:[currentUser.uid]
            },
            {
              merge : true
            })
          })
          .then(() => 
          {
            alert("✔Learning space created successfully.");
            navigate(`/learningspace/${spaceId}`);
          })
        })
          break;
      case 2:
        const updateDB = async () =>
        {
          await setDoc(doc(db2, "learning_spaces", spaceId),
          {
            id: spaceId,
            admin: currentUser.uid,
            members: 1,
            title: title,
            desc: desc,
            prereq: inputTags,
            url: imgUrl,
            timestamp: serverTimestamp(),
            users:[currentUser.uid]
          },
          {
            merge: true
          })
          .then(() => navigate('/'))
          .catch(() => setError("Error!")
          )
        }
        updateDB();
        break;
      default: return console.log("Error in setting data")
    }
  }

  const handleSubmitForm = (e) => 
  {
    e.stopPropagation();
    setLoading(true);

    if(error)
      window.scrollTo(0,0)
    
    if(inputTags.tags.length == 0) 
    {
      setLoading(false)
      setError("Please add prerequisites.")
    }

    if(files)  
    {
      setData(1)
    }
    else if(imgUrl)
    {
      setData(2)
    }
    else
    {
      setError("Please choose thumbnail for the learning space.")
      setLoading(false);
    }
  }
  
  const handleFile = (files) => 
  {
    if(files[0].size > 2000000)
    {
      alert("⚠ File size too big.");
      return;
    }
    setFiles(files[0]);
    setImgUrl("");
  }
  
  const handleDrag = (e) => 
  {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover")
      setDragActive(true);
    else if (e.type === "dragleave")
      setDragActive(false);
  }

  const handleDrop = (e) => 
  {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFile(e.dataTransfer.files);
  }

  const handleChange = (e) => 
  {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) 
      handleFile(e.target.files);
  };

  const onButtonClick = () => inputRef.current.click();

 
 useEffect(() =>
 {
   if(error)
    window.scrollTo(0,0)
 }, [error])
 
  
  return (
    <div className="crlsp-container">
      <div className="crlsp-card">
        <div className="load-logo center">
          <i className="fa fa-book-open-reader load-icon fa-4x"></i>
        </div>
        <h3>Create a Learning Space</h3>
        <div>
          {error && (
              <ErrorAlert>{error}</ErrorAlert>
          )}
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            className="input-elem inp-ext"
            required
            id="title"
            ref={titleRef}
          />
          <label htmlFor="desc">Description:</label>
          <textarea
            type="text"
            className="input-elem inp-ext"
            required
            rows="3"
            id="desc"
            ref={descRef}
          />
          <div>
            <label htmlFor="tags">Prerequisites:</label>
            <TagsInput
              className="tagclass inp-ext"
              value={inputTags.tags}
              focusedClassName="tagclass"
              onChange={(tags) => handleTagChange(tags)}
              inputProps={{ placeholder: "Add a tag" }}
              addKeys={[9, 13, 188]}
              removeKeys={[8]}
            />
          </div>
          <div className="mt-2 d-flex al-st flex-col">
            <label>Choose Thumbnail (size limit is 2mb):</label>
            <div style={{ width: "100%", fontStyle: "italic" }}>
              {imgUrl && imgUrl}
            </div>

            <DragDropFile
              handleDrag={handleDrag}
              handleFile={handleFile}
              handleDrop={handleDrop}
              handleChange={handleChange}
              inputRef={inputRef}
              dragActive={dragActive}
              setDragActive={setDragActive}
              onButtonClick={onButtonClick}
              files={files}
            />
          </div>
          <button
            disabled={loading}
            onClick= {handleSubmitForm}
            className="submitBtn crlsp-btn-ext"
          >
     
            {loading ? (
              <i
                className="fa fa-spinner fa-spin"
                style={{ fontSize: "24px" }}
              ></i>
            ) : (
              <>Create</>
            )}
          </button>
        </div>
      </div>
      <ChooseImageModal
        open={openModal}
        setOpen={setOpenModal}
        setImgUrl={setImgUrl}
        setFiles={setFiles}
      />
    </div>
  );
}
       {/* <div
              onClick={() => {
                handleOpenModal();
              }}
              className="saveBtn crlspc-search-btn"
            >
              Search Image
              <i className="ml-2 fa fa-search" />
            </div> */}
      {/* <div className="m">
              <h4>or</h4>
            </div> */}