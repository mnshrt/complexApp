import React, { useEffect } from "react"
import { useContext } from "react"
import { useImmer } from "use-immer"
import Axios from "axios"
import {Link} from "react-router-dom"
import StateContext from "../StateContext"
import LoadingDotsIcon from "./LoadingDotsIcon"
import Page from "./Page"
import Post from "./Post"


function Home() {
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    isLoading:false,
    feed:[]
  })
  useEffect(() => {

    const ourRequest = Axios.CancelToken.source();
    async function fetchData(){
      try {
          const response = await Axios.post("/getHomeFeed",{token: appState.user.token},)
          setState(draft=> {
            draft.isLoading= false,
            draft.feed = response.data})
          
      } catch (error) {
          console.log("there was a problem")
      }
    }
    fetchData()
    return ()=> ourRequest.cancel()
  }, [])
  if(state.isLoading){
    return <LoadingDotsIcon/>
  }
  return (
    <Page title="Your Feed">

    {
      state.feed.length>0 && (
        <>
        <h2 className="text-center mb-4">The latest from those you follow</h2>
        <div className="list-group">{state.feed.map(post=>{
        <Post key={post._id} post={post}/>
       })}</div>
        </>
      )
    }
 {state.feed.length==0 && (<> <h2 className="text-center">Hello <strong>{appState.user.username}</strong>, your feed is empty.</h2>
      <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p></>)}
    </Page>
  )
}

export default Home