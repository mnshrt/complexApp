import React, { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
 // const navigate = useNavigate()
  function handleLogout(){
   appDispatch({type:"logout", loggedIn:false})
  }

  function handleSearchIcon(e){
    e.preventDefault();
    appDispatch({type:"openSearch"})
  }
  return (
    <div className="flex-row my-3 my-md-0">
    <a href="#"  onClick={handleSearchIcon} className="text-white mr-2 header-search-icon">
      <i className="fas fa-search"></i>
    </a>
    <span className="mr-2 header-chat-icon text-white">
      <i className="fas fa-comment"></i>
      <span className="chat-count-badge text-white"> </span>
    </span>
    <Link to={`/profile/${appState.user.username}`} className="mr-2">
      <img className="small-header-avatar" src={appState.user.avatar} />
    </Link>
    <Link className="btn btn-sm btn-success mr-2" to="/create-post">
      Create Post
    </Link>
    <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
      Sign Out
    </button>
  </div>
  )
}

export default HeaderLoggedIn