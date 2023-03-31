import React, {useEffect, useRef, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthProvider'
import { ErrorAlert } from './ErrorAlert'
import '../styles/auth.css'

export const LogIn = () => 
{
    const emailRef = useRef()
    const passRef = useRef()
    const eyeRef = useRef()
    const { login } = useAuth()
    const { signInGoogle, signInFacebook } = useAuth()
    const [ error, setError ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()

    async function handleLogIn(e) 
    {
        e.preventDefault();
        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passRef.current.value);
            navigate("/")
          } 
          catch(e)
          {
            setError("Failed to log in");
          }
          setLoading(false);
    }

    async function logInGoogle() 
    {   
        setLoading(true);
        try{
            await signInGoogle()
            navigate("/");
        }
        catch
        {
            setError("Failed to log in");
        }
        setLoading(false);
    }

    async function logInFacebook() 
    {
        setLoading(true);
        try{
            await signInFacebook()
            navigate("/");
        }
        catch
        {
            setError("Failed to log in");
        }
        setLoading(false);
    }

    /**
     * seePassword - show password on input of type password 
     */
    const seePassword = () =>
    {
        if(passRef.current.type === "password")
        {
            passRef.current.type = "text";
            eyeRef.current.style = "color: var(--secondary)";
        }
        else
        {
            eyeRef.current.style = "color:black";
            passRef.current.type = "password"
        }
    }
    
    useEffect(() => { return () => { document.body.style.background = "#f3f3f3" } }, [])
    
    return (
    <div className='main-div'>
        <form onSubmit={(e) => handleLogIn(e)}  id="form">
            <div className='load-logo center mb-2'>
                <i className="fa fa-book-open-reader fa-4x"></i>
            </div>
            <h2 style={{margin:"unset", color:"var(--secondary)"}}>Co learn</h2>
            <h2 style={{marginBottom:"unset", color:"white"}} id='header'>Log in</h2>
            {error&&
                <ErrorAlert>{error}</ErrorAlert>}

            <div className='input-div'>
                <label htmlFor="email">Username/Email</label>
                <div className='seepassword'>
                    <input ref={emailRef}  className='input-elem' required id="email" placeholder="Username/Email" type="email"/>
                </div>
            </div>

            <div className='input-div'>
                <label htmlFor="password">Password</label>
                <div className='seepassword'>
                    <input ref={passRef} className='input-elem' required id="password" placeholder="Password" type="password"/>
                    <i ref={eyeRef} title='Show Password' className="fa fa-eye" onClick={()=>seePassword()} id="togglePassword" ></i>
                </div>
            </div>
            <button disabled={loading} id="loginBtn" type="submit" >
                {loading?<i className="fa fa-spinner fa-spin" style={{fontSize:"24px"}}></i>:<>Log In</>}
            </button>
            <div className='signuplink' >
                <p>Need an account? <Link to='/signup'>Sign Up</Link></p>
            </div>
            <div className='or'>
                <div className='line'></div>
                <span>or</span>
                <div className='line'></div>
            </div>
            <div id="socials-container">
                <span title='Log in with Google' onClick={()=>logInGoogle()}>
                    <i  className="fa-brands fa-google"></i>
                    <div className='flare'></div>
                </span>
                <span title='Log in with Facebook/Meta' onClick={()=>logInFacebook()}>
                    <i  className="fa-brands fa-facebook-f"></i>
                    <div className='flare'></div>
                </span>            
            </div>
        </form>
    </div>
  )
}
