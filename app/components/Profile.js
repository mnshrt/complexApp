import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Axios from "axios"
import Page from "./Page"
import StateContext from "../StateContext"
import { useContext } from "react"
import ProfilePosts from "./ProfilePosts"
import { useImmer } from "use-immer"

function Profile() {
    const {username} = useParams()
    const appState = useContext(StateContext)
    const [state, setState] = useImmer({
      followActionLoading: false,
      startFollowingRequestCount:0,
      stopFollowingRequestCount:0,
      profileData:{
        profileUsername:'',
        profileAvatar:'https://gravatar.com/avatar/placeholder?s=128',
        isFollowing: false,
        counts:{
            postCount:"",
            followerCount:"",
            followingCount:""
        }
    }
    })

    useEffect(() => {
      async function fetchData(){
        try {
            const response = await Axios.post(`/profile/${username}`,{token: appState.user.token})
            setState(draft=> {draft.profileData = response.data})
            
        } catch (error) {
            console.log("there was a problem")
        }
      }
      fetchData()
    }, [])
    
  return (
    <Page title="profile-page">
        <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing &&appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != '...' && (
          <button className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </a>
      </div>
<ProfilePosts/>

    </Page>
  )
}

export default Profile