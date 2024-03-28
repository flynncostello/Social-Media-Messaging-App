// routes.js
const ROUTES = {
    root: () => "/",
    login: () => "/login",
    signup: () => "/signup",
    dashboard: (userId) => `/dashboard/${userId}`,
    userAccount: (userId) => `/userAccount/${userId}`
};

export default ROUTES;
  