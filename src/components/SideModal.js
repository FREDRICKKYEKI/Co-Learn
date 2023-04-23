import React, { useEffect, useRef } from 'react'
import ReactDOM  from 'react-dom'
import { Highlight } from './Highlight';
import { useSpaceContext } from './LearningSpace';
import './styles/modal.css'

export const SideModal = ({open, setOpen}) => 
{
  const { user } = useSpaceContext()
  const modalRef = useRef();
  const { highlights } = useSpaceContext();
    

  open?document.body.style = "overflow-y: hidden":document.body.style = "overflow-y: scroll"

  const closeModal = (e) => 
  {
    e.stopPropagation();
    if(!e.target.classList.contains("cancel") && !e.target.classList.contains("side-modal-overlay")) /*prevent event capture/bubbling issues*/
      return;    
    else
      setOpen(false)
  }

  return (
    <div>
        {/* {ReactDOM.createPortal( */}
            <div onClick={(e)=>{ closeModal(e) }}  className='side-modal-overlay '>
                <div ref={modalRef} className='side-modal open-modal'>
                  <i onClick={(e)=>{ closeModal(e) }} className='fa fa-times cancel' />
                  <h2>Highlights ({highlights.length})</h2>
                  <div className='highlights'>
                    {highlights.map(h =>
                      <Highlight highlightObj={h} userObj={user} forSide={true} />
                    )}
                  </div>
                </div>
            </div>
        {/* ,document.body)} */}
    </div>
  )
}
