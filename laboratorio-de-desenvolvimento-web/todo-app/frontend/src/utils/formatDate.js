// O prazo é salvo como meia-noite UTC. Formatar em UTC evita mostrar um dia a menos no Brasil.
export function formatDueDate(value) {
  if (!value) return "Sem data";
  return new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}