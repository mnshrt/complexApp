import React, { useContext, useEffect } from "react"
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Axios from "axios"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import { Link } from "react-router-dom";

import Page from "./Page"
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
function ViewSinglePost() {
  const {id} = useParams();
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const appState= useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
   const navigate = useNavigate()
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPosts(){
      try{
        const response = await Axios.get(`/post/${id}`,{cancelToken:ourRequest.token})
        setPost(response.data)
        setIsLoading(false)
      }catch(e){
        console.log("there was a problem or the request was cancelled")
      }
      return ()=> ourRequest.cancel()
    }
fetchPosts()
  }, [id])
  
if(!isLoading && !post){
  return <NotFound/>
}
  if(isLoading){
    return <Page title="...">Loading... </Page>
  }
  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  function isOwner(){
    if(appState.loggedIn){
    return appState.user.username == post.author.username
    }
    return false
  }
  async function deleteHandler(){
    const areYouSure = window.confirm("Do you really want to delete this post?")
    if(areYouSure){
      try {
        const response = await Axios.delete(`/post/${id}`,{data:{token:appState.user.token}})
        if(response.data=="Success"){
          //1. display the success message
          appDispatch({type:"flashMessage", value:"Post was successfully deleted"})
          //2. redirect back to the current user's profiles
            navigate(`/profile/${appState.user.username}`)
        }
      } catch (error) {
        console.log("there was a problem")
      }
    }
  }
  return (
  <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() &&(<span className="pt-2">
          <Link to={`/post/${post._id}/edit?`} data-tip="Edit" data-for="edit" className="text-primary mr-2" ><i className="fas fa-edit"></i></Link>
          <ReactTooltip id="edit" className="custom-tooltip"/>{" "}
          <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger" title="Delete"><i className="fas fa-trash"></i></a>
          <ReactTooltip id="delete" className="custom-tooltip"/>
        </span>)}
        
      </div>

      <p className="text-muted small mb-4">
        <a href="#">
          <img className="avatar-tiny" src={post.author.avatar} />
        </a>
        Posted by <a href="#">{post.author.username}</a> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body}/>
      </div>
    
  </Page>
  )
}

export default ViewSinglePost