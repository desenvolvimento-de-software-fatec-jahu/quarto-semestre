import api from "./client.js";

export const getChatHistory = (todoId) => api.get(`/chat/${todoId}/messages`);