import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Tasks from './components/tasks/Tasks';
import TaskPage from './components/tasks/TaskPage';
import Home from './components/home/Home';

const RouteManager = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Save the current route path in localStorage when route changes
    localStorage.setItem('lastPath', location.pathname);
  }, [location]);

  useEffect(() => {
    // Retrieve the last path from localStorage
    const lastPath = localStorage.getItem('lastPath');

    // If there's a last path, navigate to it on initial render
    if (lastPath) {
      navigate(lastPath);
    }
  }, [navigate]);

  return null;
};

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:task_id" element={<TaskPage />} />
          <Route path="*" element={<RouteManager />} />
        </Routes>
      </Router>
    </Provider>
  );
}
