import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthProvider'
import { ErrorAlert } from './ErrorAlert'
import { Modal } from '../Modal'
import "../styles/modal.css"


export const LogOutModal = ({open, setOpen}) => 
{
    const { logout} = useAuth()
    const [error, setError] = useState("")
    const navigate = useNavigate()
    
    const handleLogout = async () =>
    {
        setError("")
        try
        {
            await logout()
            navigate("/login")
        } 
        catch 
        {
            setError("Failed to log out")
        }
    }
  return (
    <Modal open={open} setOpen={setOpen}>
        {error&&<ErrorAlert>{error}</ErrorAlert>}
        <p>
            Are you sure you want to log out?
        </p>
        <div className='lgout-btn-div'>
            <button className='submitBtn d-btn' onClick={()=>setOpen(false)}>No</button>
            <button className='submitBtn d-btn' onClick={()=>handleLogout()}>Yes</button>
        </div>
    </Modal>
  )
}
