import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Tasks from './components/tasks/Tasks';
import TaskPage from './components/tasks/TaskPage';
import Home from './components/home/Home';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Save the current route path in localStorage when route changes
    const handleRouteChange = () => {
      localStorage.setItem('lastPath', window.location.pathname);
    };

    const unlisten = navigate(handleRouteChange);

    return () => {
      unlisten();
    };
  }, [navigate]);

  useEffect(() => {
    // Retrieve the last path from localStorage
    const lastPath = localStorage.getItem('lastPath');

    // If there's a last path, navigate to it on initial render
    if (lastPath) {
      navigate(lastPath);
    }
  }, [navigate]);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:task_id" element={<TaskPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}
