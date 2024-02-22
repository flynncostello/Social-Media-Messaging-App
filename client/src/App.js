import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Home from './components/home/Home';
import Tasks from './components/tasks/Tasks';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store/store';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Tasks/>}/>
        </Routes>
      </Router>
    </Provider>
  )
};
