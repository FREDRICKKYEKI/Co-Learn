import React, {useRef, useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorAlert } from './ErrorAlert'
import { useAuth } from '../Contexts/AuthProvider'
import { db } from '../../firebase'
import '../styles/auth.css'
import { doc, serverTimestamp, setDoc} from 'firebase/firestore/lite'


export const SignUp = () => {
    const emailRef = useRef()
    const FNameRef = useRef() 
    const LNameRef = useRef()
    const passRef = useRef()
    const eyeRef = useRef()
    const { signup, authWithGoogle, authWithFacebook, currentUser } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
  
    async function handleSignUp(e) 
    {
        e.preventDefault();
        const fName = FNameRef.current.value;
        const lName = LNameRef.current.value;
        const email = emailRef.current.value;
        
        try 
        {
            setError("")
            setLoading(true)
            await signup(emailRef.current.value, passRef.current.value)
            
        } 
        catch (e)
        {   
            setError("Failed to create an account")
            setLoading("false");
        }
        if(currentUser)
        {
            const uid = currentUser.uid
            await setDoc(doc(db,'users',uid),
            {
                id: uid,
                names:{firstName:fName,secondName:lName},
                email: email,
                timestamp: serverTimestamp(),
                url:"",
                bio:"",
                interests:""
            });
            setLoading(false);
            navigate("/");
        }
        else
        {
            setError("Ooops😥...Something went wrong please try again.");
            setLoading(false);
        }
    }
    
    
    async function handleGoogleSignUp()
    {
        try
        {
            await authWithGoogle()
            navigate('/')
        }
        catch
        {
            setError("Failed to create an account")
        }
    }

    async function handleFacebookSignUp()
    {
        try
        {
            await authWithFacebook()
            navigate('/')
        }
        catch
        {
            setError("Failed to create an account")
        }
    }

    const seePassword = () =>
    {
        if(passRef.current.type==="password")
        {
            passRef.current.type="text";
            eyeRef.current.style ="color: var(--secondary)";
        }else
        {
            eyeRef.current.style ="color:black";
            passRef.current.type="password"
        }
    }

    useEffect(() => {return () => document.body.style.background="#f3f3f3"},[])
    
    return (    
    <div className='main-div'>
        <div className='signup-wrapper'>
        <form  onSubmit={(e)=>handleSignUp(e)}  id="form">
            <div className='load-logo center'>
                <i className="fa fa-book-open-reader fa-4x"></i>
            </div>
            <h2 style={{margin:"unset", color:"var(--secondary)"}}>Co learn</h2>
            <h2 style={{marginBottom:"unset", color:"white"}} id='header'>Sign Up</h2>
            {error&&
                <ErrorAlert>{error}</ErrorAlert>
            }
            <div id='names' className='names-div'>
                <div className='input-div name seepassword'>
                    <label htmlFor="firstname">Enter your names</label>
                    <input ref={FNameRef}  maxLength='20' className='input-elem' required id="firstname" placeholder="First Name" type="text"/>
                </div>

                <div className='input-div name seepassword'>
                    <label htmlFor="lastname">&#0;</label>
                    <input ref={LNameRef} maxLength='20'  className='input-elem ' required id="lastname" placeholder="Last Name" type="text"/>
                </div>
            </div>

            <div className='input-div'>
                <label htmlFor="email">Username/Email</label>
                <div className='seepassword'>
                    <input ref={emailRef}  className='input-elem' required id="email" placeholder="Email" type="email"/>
                </div>
            </div>

            <div className='input-div'>
                <label htmlFor="password">Password</label>
                <div className='seepassword'> 
                    <input ref={passRef} className='input-elem' required id="password" placeholder="Password" type="password"/>
                    <i ref={eyeRef} title='Show Password' className="fa fa-eye" onClick={()=>seePassword()} id="togglePassword" ></i>
                </div>
            </div>
            
            <button disabled={loading} id="loginBtn" type="submit">
                {loading?<i className="fa fa-spinner fa-spin" style={{fontSize:"24px"}}></i>:<>Sign Up</>}
            </button>
            <div className='signuplink' >
                <p>Already have an account? <Link to='/login'>Log In</Link></p>
            </div>
            <div className='or'>
                <div className='line'></div>
                <span>or</span>
                <div className='line'></div>
            </div>
            <div id="socials-container">
                <span title='Sign Up with Google' onClick={()=>handleGoogleSignUp()}>
                    <i className="fa-brands fa-google"></i>
                    <div className='flare'></div>
                </span>
                <span title='Sign Up with Facebook/Meta' onClick={()=>handleFacebookSignUp()}>
                    <i className="fa-brands fa-facebook-f"></i>
                    <div className='flare'></div>
                </span>            
            </div>
        </form>
        </div>
    </div>

  )
}
