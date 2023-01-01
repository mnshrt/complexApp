import React, { useEffect, useState } from "react"
import Axios from "axios";
import { Link, useParams } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
function ProfileFollow({action}) {
const {username} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [followData, setFollowData] = useState([])
useEffect(() => {
  async function fetchFollowData(){
    try{
        const response = await Axios.get(`/profile/${username}/${action}`)
        setIsLoading(false)
        setFollowData(response.data)
    }catch(e){
        console.log("there was a problemfirst")
    }    
  }
  fetchFollowData()

}, [username])

    if(isLoading) return <LoadingDotsIcon/>
  return (
    <div className="list-group">
       {followData.map((data,index)=>{
        return (
            <Link key={index} to={`/${action}/${data.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={data.avatar} /> {data.username}
            </Link>
        )
       })}
    </div>
  )
}

export default ProfileFollow