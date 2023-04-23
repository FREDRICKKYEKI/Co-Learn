import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () =>
{
	return(
		<footer className='footer-container'>
			<section className='section'>
				<i className='fa fa-book-open-reader load-icon fa-4x'/>
				<h3 style={{margin:"unset"}}>Co-Learn</h3>
				<a href="fredrickisaac142@gmail.com">
					@By Fredrick Isaac
				</a>
			</section>
			<hr style={{width:"100%"}}/>
			<section className='section'>
				<div className='footer-links'>
					<h3 style={{marginTop:"unset"}}>Important links</h3>
					<Link to="/">Home</Link>
					<Link to="/createlearningspace">Create space</Link>
					<Link to="/profile">Profile</Link>
					<Link to="/login">LogIn</Link>
					<Link to="/signup">Sign up</Link>
				</div>
			</section>
			<hr style={{width:"100%"}}/>
			<section>
				<p>
					Copyright © 2023 Co-Learn, All rights reserved.
				</p>
			</section>
		</footer>
	)
}