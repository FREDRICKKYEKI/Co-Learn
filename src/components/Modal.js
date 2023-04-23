import React, {useEffect} from 'react'
import './styles/modal.css'

export const Modal = ({open, setOpen, children}) => 
{

open?document.body.style = "overflow-y: hidden":document.body.style = "overflow-y: scroll"

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
        {open&&(
			<div className='overlay'>
				<div className='modal'>
				<i onClick={(e)=>{ closeModal(e) }} className='fa fa-times cancel' />
					{children}
				</div>
			</div>)}
    </>
  )
}
