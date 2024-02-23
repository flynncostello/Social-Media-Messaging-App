// routes.js
const ROUTES = {
    root: () => "/",
    tasks: () => "/tasks",
    taskRoute: (task_id) => `/tasks/${task_id}`,
};
  
export default ROUTES;
  