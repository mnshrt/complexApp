import React, { useEffect, useState } from "react"
import Axios from "axios";
import { Link, useParams } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";
function ProfilePosts() {
const {username} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
useEffect(() => {
  async function fetchPosts(){
    try{
        const response = await Axios.get(`/profile/${username}/posts`)
        setIsLoading(false)
        setPosts(response.data)
    }catch(e){
        console.log("there was a problemfirst")
    }    
  }
  fetchPosts()

}, [username])

    if(isLoading) return <LoadingDotsIcon/>
  return (
    <div className="list-group">
       {posts.map(post=>{

        return (
<Post key={post._id} post={post} noAuthor={true}/>
        )
       })}
    </div>
  )
}

export default ProfilePosts