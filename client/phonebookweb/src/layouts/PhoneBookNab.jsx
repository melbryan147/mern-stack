import React from 'react'
import {Outlet, Link} from 'react-router-dom'

function NavBar() {
  return (
    <>
    <div>NavBar</div>
     <nav>
        <Link to="homepage">Home</Link>| {" "}
        <Link to="login">Login</Link>| {" "}
        <Link to="register">Register</Link>
     </nav>
          
     <div>
        <Outlet/>
     </div>
    </>
  )
}

export default NavBar