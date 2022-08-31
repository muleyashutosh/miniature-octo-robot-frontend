import React from 'react'
import  Dashboard  from './components/Dashboard/Dashboard';
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Missing from './components/Missing'
import SignIn from './components/Signin/Signin';
import RequireAuth from './components/RequireAuth'
// import Received from './components/Received';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<SignIn />}/>
        
        {/* protected routes */}
        <Route element = {<RequireAuth/>} >
          <Route
            path="/home/*"
            element={
              <Dashboard />
            }
          />
        </Route>
        {/* <Route element = {<RequireAuth/>} >
          <Route
            path="/received"
            element={
              <Received />
            }
          />
        </Route> */}
        <Route
          path="*"
          element={<Missing />}
        />
        
      </Route>
    </Routes>
  );
}

export default App;
