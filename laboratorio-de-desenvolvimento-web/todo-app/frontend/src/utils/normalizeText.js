// Remove acentos e deixa o texto em minúsculas, para comparar o que foi falado
export function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}