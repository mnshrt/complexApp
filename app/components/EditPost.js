import React, { useContext, useEffect, useReducer} from "react"
import {useParams, useNavigate} from "react-router-dom"
import Page from "./Page";
import Axios from "axios"
import {useImmerReducer} from "use-immer"
import {Link} from "react-router-dom"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import NotFound from "./NotFound";
function EditPost() {
  const navigate = useNavigate()
  const appState= useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const originalState ={
    title:{
      value:"",
      hasErrors:false,
      message:""
    },
    body:{
      value:"",
      hasErrors:"",
      message:""
    },
    isFetching:true,
    isSaving:false,
    id:useParams().id,
    sendCount: 0
  }
  function postReducer(draft, action){
    switch(action.type){
      case "fetchComplete":
        draft.title.value = action.value.title,
        draft.body.value = action.value.body,
        draft.isFetching= false
        return
      case "titleChange":
        draft.title.hasErrors=false
        draft.title.value= action.value
        return
      case "bodyChange":
        draft.body.hasErrors=false
        draft.body.value= action.value
        return
      case "submitRequest":

      if(!draft.title.hasErrors && !draft.body.hasErrors){
        draft.sendCount++
      }
        return;
      case "saveRequestStarted":
        draft.isSaving=true
        return;
      case "saveRequestFinished":
        draft.isSaving=false
          return;
      case "titleRules":
        if(!action.value.trim()){
          draft.title.hasErrors=true
          draft.title.message="you must provide a title"
        }
        return
      case "bodyRules":
          if(!action.value.trim()){
            draft.body.hasErrors=true
            draft.body.message="you must provide body content"
          }
          return
      case "notFound":
        draft.notFound= true
        return 

    }

  }
  const [state, dispatch] = useImmerReducer(postReducer,originalState)

  function submitHandler(e){
    e.preventDefault();
    dispatch({type:"titleRules",value:state.title.value})
    dispatch({type:"titleRules",value:state.body.value})
    dispatch({type:"submitRequest"})
  }
  
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost(){
      try{
        const response = await Axios.get(`/post/${state.id}`,{cancelToken:ourRequest.token})
        if(response.data){
          dispatch({type:"fetchComplete", value:response.data})
          if(appState.user.username !== response.data.author.username){
            appDispatch({type:"flashMessage", value:"you donot have permission to edit the post"})
            //redirect to homepage
            navigate("/")
          }
        }else{
          dispatch({type:"notFound"})
        }
        
      }catch(e){
        console.log("there was a problem or the request was cancelled")
      }
      return ()=> ourRequest.cancel()
    }
fetchPost()
  }, [])

  useEffect(() => { 
        if(state.sendCount>0){
          dispatch({type:"saveRequestStarted"})
          const ourRequest = Axios.CancelToken.source()
          async function updatePost(){
            try{
              const response = await Axios.post(`/post/${state.id}/edit`,{title:state.title.value, body:state.body.value, token:appState.user.token},{cancelToken:ourRequest.token})
              
              dispatch({type:"saveRequestFinished"})
              appDispatch({type:"flashMessage", value:"Post was updated"})
            }catch(e){
              console.log("there was a problem or the request was cancelled")
            }
            return ()=> ourRequest.cancel()
        }
        updatePost()
    }

  }, [state.sendCount])
  if(state.notFound){
    return <NotFound/>
  }
  if(state.isFetching){
    return <Page title="...">Loading... </Page>
  }
  // const date = new Date(post.createdDate)
  // const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>&laquo; Back to post permalink</Link>
         <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input value={state.title.value} onChange={(e)=>dispatch({type:"titleChange", value:e.target.value})} onBlur={()=> dispatch({type:"titleRules", value:e.target.value})} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea  name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} onChange={(e)=>dispatch({type:"bodyChange", value:e.target.value})} onBlur={e=>dispatch({type:"bodyRules", value: e.target.value})}></textarea>
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>Save Updates</button>
      </form>
    </Page>
  )
}

export default EditPost