import React from 'react'

export const LoadingScreen = () => {
  return (
    <div className='loader'>
        <h1>Co-Learn</h1>
        <div className='load-logo anim'>
            <i className="fa fa-book-open-reader load-icon fa-4x"></i>
        </div>
        <h3>Loading...</h3>
    </div>
  )
}
