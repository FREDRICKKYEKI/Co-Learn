import React, {  } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './styles/nav.css'

export const NavBar = () => 
{
  const styles = ({isActive})=> {
        return{
          fontWeight : isActive? 'bold' : 'normal'
        }
  }
  return (
    <>
      <div className = 'navbar'>
        <NavLink to = '/'>       
          <div className = "logo">
              <i className = "fa fa-book-open-reader card-logo fa-3x"></i>
              <h2>
                Co-Learn
              </h2>
          </div>
        </NavLink>
        <input type = "checkbox" id = "nav-toggle" className = "nav-toggle"/>
        <nav>
          <ul>
            <li><NavLink style = {styles} to = '/'>Home</NavLink></li>
            <li><NavLink style = {styles} to = '/createlearningspace'>Create Learning Space</NavLink></li>
            <li><NavLink style = {styles} to = '/profile'>Profile</NavLink></li>
          </ul>
        </nav>
        <label htmlFor="nav-toggle" className="nav-toggle-label">
          <span></span>
        </label>
      </div>
    </>
  )
}
