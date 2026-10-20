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