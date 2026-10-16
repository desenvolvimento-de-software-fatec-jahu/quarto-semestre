import api from "./client.js";

export const getUsers = () => api.get("/users");