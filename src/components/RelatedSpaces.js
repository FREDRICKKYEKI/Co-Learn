import React,{useRef, useEffect} from 'react'
import { RlspCard } from './RlspCard'

export const RelatedSpaces = () => {
  const containerRef = useRef()
  
  const scrollH = (d) =>
  {
    switch(d)
    {
      case "p":
        containerRef.current.scrollLeft-=300;
        break;
      case "n":
        containerRef.current.scrollLeft+=300;
        break;
        }
        // console.log(containerRef.current.scrollLeft)
  }
  useEffect(() => {
    
  }, [])
  
  return (
    <>
      <h3><u>Related Learning Spaces.</u></h3>
      <div className='rlspc-div'>
        <div onClick={() => scrollH("p")} className='rlspc-prev-btn'>
            <i className='fa fa-angle-left fa-3x'/>
        </div>
        <div ref={containerRef} className='rlspc-container'>
          <RlspCard/>
          <RlspCard/>
          <RlspCard/>
          <RlspCard/>
          <RlspCard/>
          <RlspCard/>
        </div>
        <div onClick={() => scrollH("n")} className='rlspc-nxt-btn'>
            <i className='fa fa-angle-right fa-3x'/>
        </div>
      </div>
    </>
  )
}