import api from "./client.js";

export const getTodos = () => api.get("/todos");
export const getTodoById = (id) => api.get(`/todos/${id}`);
export const createTodo = (payload) => api.post("/todos", payload);
export const updateTodo = (id, payload) => api.put(`/todos/${id}`, payload);
export const updateTodoStatus = (id, status) =>
  api.patch(`/todos/${id}/status`, { status });
export const deleteTodo = (id) => api.delete(`/todos/${id}`);