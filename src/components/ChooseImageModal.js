import React, { useEffect, useState } from 'react'
import { Modal } from './Modal'
import axios from 'axios'
import { LoadingScreen } from './LoadingScreen'

export const ChooseImageModal = ({open, setOpen, setImgUrl, setFiles}) => {
  const [data, setData] = useState([])
  const [params, setParams] = useState("library")
  const [loading, setLoading] = useState(true)
  
  useEffect(() => 
  { 
    const controller = new AbortController();
    axios.get(`https://pixabay.com/api/?key=34063357-daed89a4217f6a39e0db08492&q=${params.split(" ").join("+")}&image_type=photo&orientation=verical&per_page=30&page=5`, 
    {
      signal: controller.signal
    })
      .then(res =>
        {
          setData(res.data.hits)
          setLoading(false)
        })
    return(()=>
    {
      controller.abort();
    })
  }, [params])  

  const handleChange = (e) =>
  {
    setParams(e.target.value)
  }
  
  const handleFormSubmit = (e) => e.preventDefault() 

  const handleImgClick = (url) =>
  {
    setImgUrl(url)
    setFiles("")
    setOpen(false)
  }
  return (
    <Modal open={open} setOpen={setOpen}>
      <form onSubmit={(e) => handleFormSubmit(e)} className="choose-image-card ">
        <div class="search-container">
          <h3>Search Image</h3>
          <form onSubmit={e => e.preventDefault()} class="no-submit">
            <input
              class="no-submit"
              type="search"
              placeholder="Search..."
              method="GET"
              value={params}
              onChange={(e) => handleChange(e)}
            />
          </form>
        </div>
        <div className='choose-imgs'>
          {loading?"Loading..."
          :<>
            {data.map((img,index) => 
              <img onClick={() => handleImgClick(img.largeImageURL)} key={index} src= {`${img.largeImageURL}`}/>
            )}
          </>}
        </div>
      </form>
    </Modal>
  );
}
