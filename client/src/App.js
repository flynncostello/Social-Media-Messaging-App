import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/home/Home';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store/store';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>

          <Route path="/" element={<Home/>}/>
        </Routes>
      </Router>
    </Provider>
  )
};
