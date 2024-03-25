// routes.js
const ROUTES = {
    root: () => "/",
    login: () => "/login",
    signup: () => "/signup",
    dashboard: (userId) => `/dashboard/${userId}`,
    chatroom: (chatroomId, userId) => `/chatroom/${chatroomId}/${userId}`,
};

export default ROUTES;
  