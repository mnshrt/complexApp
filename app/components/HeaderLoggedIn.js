import React, { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import ReactTooltip from "react-tooltip"
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
    <a href="#"  data-for="search" data-tip="Search" onClick={handleSearchIcon} className="text-white mr-2 header-search-icon">
      <i className="fas fa-search"></i>
    </a>
    <ReactTooltip place="bottom" id="search" className="custom-tooltip"/>{"  "}
    <span data-for="chat" data-tip="Chat" className="mr-2 header-chat-icon text-white">
      <i className="fas fa-comment"></i>
      <span className="chat-count-badge text-white"> </span>
    </span>
    <ReactTooltip place="bottom" id="chat" className="custom-tooltip"/>{"  "}
    <Link data-for="profile" data-tip="My Profile" to={`/profile/${appState.user.username}`} className="mr-2">
      <img className="small-header-avatar" src={appState.user.avatar} />
    </Link>
    <ReactTooltip place="bottom" id="profile" className="custom-tooltip"/>{"  "}
    <Link className="btn btn-sm btn-success mr-2" to="/create-post">
      Create Post
    </Link>{" "}
    <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
      Sign Out
    </button>
  </div>
  )
}

export default HeaderLoggedIn