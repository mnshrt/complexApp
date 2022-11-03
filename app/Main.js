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

Axios.defaults.baseURL ='http://localhost:8080'


function Main() {
  const initialState={
    loggedIn:Boolean(localStorage.getItem("complexAppToken")),
    flashMessages:[]
  }
  function ourReducer(state, action){
    switch (action.type){
      case "login":
        return {loggedIn:true, flashMessages: state.flashMessages}
        case "logout":
          return {loggedIn:false, flashMessages: state.flashMessages};
        case "flashMessage":
          return {loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value)}
    }
  }  
  const [state, dispatch] = useReducer(ourReducer, initialState)
  dispatch
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexAppToken")))
  const [flashMessages, setFlashMessages] =  useState([])

  function addFlashMessage(msg){
     setFlashMessages(prev=> prev.concat(msg))
  }
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
