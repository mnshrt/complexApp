import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"
import Page from "./Page"
import DispatchContext from "../DispatchContext"

 function CreatePost(props) {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const appDispatch = useContext(DispatchContext)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        try{
        const response = await Axios.post('/create-post',{title, body, token:localStorage.getItem("complexAppToken")})
        appDispatch({type:"flashMessage" ,value:"Congrats, you successfully created a post"})
        navigate(`/post/${response.data}`)
        console.log("new Post was created");
        }catch(err){
          console.log("there was a problem")
        }
    }
  return (
    <Page title="Create New Post">
         <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea value={body} onChange={e=>setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
    
  )
}

export default CreatePost