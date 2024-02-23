import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Home from './components/home/Home';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Tasks from './components/tasks/Tasks';
import TaskPage from './components/tasks/TaskPage';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/tasks" element={<Tasks/>}/>
          <Route path="/tasks/:task_id" element={<TaskPage/>}/>
        </Routes>
      </Router>
    </Provider>
  )
};
