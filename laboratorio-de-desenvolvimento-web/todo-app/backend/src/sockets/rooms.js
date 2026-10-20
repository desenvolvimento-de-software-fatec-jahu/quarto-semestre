// Cada tarefa tem uma sala própria no Socket.io
export const getTodoRoom = (todoId) => `todo_${todoId}`;