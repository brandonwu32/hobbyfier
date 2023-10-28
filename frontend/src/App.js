import React, { useState, useEffect } from "react";
import HomePage from"./Home/HomePage";
import RecommendationsPage from "./Recommendations/RecommendationsPage";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {

    return (
        <Router>
          <Routes>
            <Route exact path = "/" element={<HomePage reference="home"/>}/>
            <Route exact path='/recommendations' element={<RecommendationsPage reference="ref"/>}/>
          </Routes>
        </Router>
    );
}

export default App;