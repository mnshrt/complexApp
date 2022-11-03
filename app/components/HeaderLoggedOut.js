import React, { useContext, useEffect } from "react"
import { useState } from "react"
import Axios from "axios"
import ExampleContext from "../ExampleContext"
import DispatchContext from "../DispatchContext"
function HeaderLoggedOut(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const appDispatch = useContext(DispatchContext)
    async function handleSubmit(e){
     e.preventDefault()

     try{
     const response = await Axios.post("/login",{username, password})
     if(response.data){
        localStorage.setItem("complexAppToken",response.data.token)
        localStorage.setItem("complexAppUsername",response.data.username)
        localStorage.setItem("complexAppAvatar",response.data.avatar)
        appDispatch({type:"logout", loggedn:true})
     }else{
        console.log("incorrect username and password");
     }
     }
     catch(e){
        console.log("there was a problem");
     }
     }
  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
    <div className="row align-items-center">
      <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
        <input name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" value={username} onChange={e=>setUsername(e.target.value)}/>
      </div>
      <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
        <input name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
      </div>
      <div className="col-md-auto">
        <button className="btn btn-success btn-sm">Sign In</button>
      </div>
    </div>
  </form>
  )
}

export default HeaderLoggedOut