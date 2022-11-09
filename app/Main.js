import React,{useReducer, useState} from "react"
import ReactDOM from "react-dom/client"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
// My Components
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/Home"
import CreatePost from "./components/CreatePost"
import Axios from "axios"
import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"
import DispatchContext from "./DispatchContext"
import StateContext from"./StateContext"
import { useImmerReducer } from "use-immer"
import { useEffect } from "react"
import Profile from "./components/Profile"

Axios.defaults.baseURL ='http://localhost:8080'


function Main() {
  const initialState={
    loggedIn:Boolean(localStorage.getItem("complexAppToken")),
    flashMessages:[],
    user:{
      token:localStorage.getItem("complexAppToken"),
      username:localStorage.getItem("complexAppUsername"),
      avatar:localStorage.getItem("complexAppAvatar"),
    }
  }
  function ourReducer(draft, action){
    switch (action.type){
      case "login":
         draft.loggedIn=true;
         draft.user=action.data
         return;
        case "logout":
           draft.loggedIn=false
           return;
        case "flashMessage":
           draft.flashMessages.push(action.value)
           return
    }
  }  
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(()=>{
    if(state.loggedIn){
      localStorage.setItem("complexAppToken",state.user.token)
      localStorage.setItem("complexAppUsername",state.user.username)
      localStorage.setItem("complexAppAvatar",state.user.avatar)
    }else{
      localStorage.removeItem("complexAppToken")
      localStorage.removeItem("complexAppUsername")
      localStorage.removeItem("complexAppAvatar")
    }
  },[state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
        <FlashMessages messages={state.flashMessages}/>
          <Header  />
          <Routes>
          <Route path="/" element={state.loggedIn?<Home/>:<HomeGuest/>}/>
            <Route path="/about-us" element={<About/>}/>
            <Route path="/terms" element={<Terms/>}/>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id" element={<ViewSinglePost/>}/>
            <Route path="/profile/:username/*" element={<Profile/>}/>
          </Routes>
          <Footer />
        </BrowserRouter>
    </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

if (module.hot) {
  module.hot.accept()
}
