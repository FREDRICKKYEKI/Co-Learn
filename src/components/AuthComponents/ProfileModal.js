import React, { useRef, useState, useEffect } from 'react'
import "../styles/modal.css"
import "react-tagsinput/react-tagsinput.css";
import TagsInput from 'react-tagsinput';
import { Modal } from '../Modal'
import { doc, setDoc } from 'firebase/firestore/lite'
import { db, storage } from '../../firebase'
import { useAuth } from '../Contexts/AuthProvider'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useMemo } from 'react'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { uuidv4 } from '@firebase/util';


export const ProfileModal = ({tags, setTags,state, open, setOpen, defaultProfile}) => 
{
  const bioRef = useRef()
  const LNameRef = useRef()
  const FNameRef = useRef() 
  const {currentUser} = useAuth()
  const [country, setCountry] = useState("ke")
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const options = useMemo(() => countryList().getData(), [])

  const handleUpload = (e) => 
  {
    const file = e.target.files[0];
    if (file == null) 
      return;
    else
      setFile(file)
  }

  const onSubmit = (e) => 
  {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true)
    if(file)
    {
      const userStorageRef = ref(storage, `/users/${currentUser.uid}`);
      const uploadTask = uploadBytesResumable(userStorageRef, file);
      uploadTask.on("state_changed",
      () => 
      {},
      ()=> 
      {
        alert("⚠ Oops. Something went terrubly wrong. Please try again.");
      },
      () =>
      {
        getDownloadURL(uploadTask.snapshot.ref).then(url =>
          {
            setDoc(doc(db, "users", currentUser.uid),{
              url : url
            },
            {
              merge : true
            })
            .then(() => 
              {
                setLoading(false);
                alert("✔ Details succesfully updated.")
                window.location.reload();
                setOpen(false);
              }
            )
            .catch(() => 
            {
              alert("⚠ Oops. Something went terrubly wrong. Please try again.");
            })
          })
          .catch(() => 
          {
            alert("⚠ Oops. Something went terrubly wrong. Please try again.");
          })
        })
    }

    const uid = currentUser.uid;
    
    setDoc(doc(db,"users", uid),
    {
      id: uid,
      email: currentUser.email,
      bio: bioRef.current.value,
      names: {firstName: FNameRef.current.value, secondName: LNameRef.current.value},
      country: country,
      interests: tags,
    },
    {
      merge : true
    }).then(() => 
    {
      setLoading(false);
      setOpen(false);
    })
    .catch(()=>
    {
      alert("⚠ Oops. Something went terrubly wrong. Please try again.");
      setLoading(false);
    });
  }

  useEffect(() => 
  {
    if(open)
    {
      FNameRef.current.defaultValue = state.names?state.names.firstName:""
      LNameRef.current.defaultValue = state.names?state.names.secondName:""
      bioRef.current.defaultValue = state.bio?state.bio:""
      setCountry(state.country)
    }
    return () => 
    {
      setFile("")
      setLoading(false)
    }
  }, [open])
  


  return (
    <Modal open={open} setOpen={setOpen}>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="profilepic-div picdiv">
          <div className="profile-inner">
            <img
              className="profilepic"
              src={`${state.url ? state.url : defaultProfile}`}
              alt="pic"
            />
            <label className="">
              <i title="Change profile picture" className="fa fa-edit"></i>
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={handleUpload}
                style={{ opacity: 0, position: "absolute", left: "-9999px" }}
              />
            </label>
          </div>
          {file && file.name}
        </div>
        <label className="mt-2" htmlFor="names">
          Enter your Names
        </label>
        <div id="names" className="names-div label-margin">
          <div className="input-div name seepassword">
            <input
              ref={FNameRef}
              maxLength="20"
              className="input-elem "
              required
              id="firstname"
              placeholder="First Name"
              type="text"
            />
          </div>

          <div className="input-div name seepassword">
            <input
              ref={LNameRef}
              maxLength="20"
              className="input-elem "
              required
              id="lastname"
              placeholder="Last Name"
              type="text"
            />
          </div>
        </div>

        <div className="country-div mt-2">
          <label htmlFor="country">Country of residence</label>
          <Select
            className='label-margin'
            required
            id="country"
            onChange={(country) => setCountry(country)}
            options={options}
            value={country}
          />
        </div>

        <div className="bio-div mt-2">
          <label htmlFor="biog">Biography</label>
          <textarea
            rows="10"
            required
            ref={bioRef}
            placeholder="Tell us a bit about yourself..."
            maxLength="400"
            className="inp input-elem label-margin"
            id="biog"
          />
        </div>
        <div className='mt-2'>
          <label>Interests:</label>
          <TagsInput
            className="tagclass label-margin"
            value={tags.tags}
            focusedClassName="tagclass"
            onChange={(tags) => setTags({ tags })}
            inputProps={{ placeholder: "Add a tag" }}
            addKeys={[9, 13, 188]} // Add a tag when Tab, Enter, or comma is pressed
            removeKeys={[8]} // Remove the last tag when Backspace is pressed
          />
        </div>
        <button disabled={loading} className="submitBtn" type="submit">
          {loading ? (
            <i
              className="fa fa-spinner fa-spin"
              style={{ fontSize: "24px" }}
            ></i>
          ) : (
            <>Submit</>
          )}
        </button>
      </form>
    </Modal>
  );
      }
