import { TODO_STATUS } from "../constants/todoStatus.js"; 

// O prazo é salvo como meia-noite UTC. Formatar em UTC evita mostrar um dia a menos no Brasil.
export function formatDueDate(value) {
  if (!value) return "Sem data";
  return new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Uma tarefa está atrasada se o prazo é anterior a hoje e ela ainda não foi concluída
export function isOverdue(dueDate, status) {
  if (!dueDate || status === TODO_STATUS.DONE) return false;

  // dueDate chega como "2026-10-13T00:00:00.000Z": compara só a parte da data
  return dueDate.slice(0, 10) < toDateInputValue(new Date());
}