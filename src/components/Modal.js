import React, {useEffect} from 'react'
import ReactDOM  from 'react-dom'
import './styles/modal.css'

export const Modal = ({open, setOpen,children}) => 
{
  useEffect(() => 
  {
    if(open)
      document.body.style = "overflow: hidden"
  
    return () => 
    {
      document.body.style = "overflow: scroll"
    }
  }, [open])
  
  const closeModal = (e) =>
  {
    e.stopPropagation();
    if(!e.target.classList.contains("cancel")) /*prevent event capture/bubbling issues*/
      return;    
    else
      setOpen(false)
  }

  return (
    <>
        {ReactDOM.createPortal(open&&
            <div className='overlay'>
                <div className='modal'>
                  <i onClick={(e)=>{ closeModal(e) }} className='fa fa-times cancel' />
                    {children}
                </div>
            </div>
        ,document.body)}
    </>
  )
}
