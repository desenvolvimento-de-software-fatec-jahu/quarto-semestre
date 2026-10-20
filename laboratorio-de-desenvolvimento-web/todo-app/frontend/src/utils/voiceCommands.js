import { TODO_STATUS } from "../constants/todoStatus.js";
import { normalizeText } from "./normalizeText.js";

// Palavras-chave FALADAS em português (pt-BR). Os identificadores do código ficam em inglês.
// A ordem importa: "data limite" precisa vir antes de "data".
const VOICE_KEYWORDS = {
  title: ["titulo"],
  description: ["descricao"],
  dueDate: ["data limite", "prazo", "data"],
  participant: ["participante", "adicionar", "incluir"],
  status: ["status", "situacao"],
};

// Status falados e o valor correspondente na API
const SPOKEN_STATUSES = [
  { keywords: ["em andamento", "andamento"], value: TODO_STATUS.IN_PROGRESS },
  {
    keywords: ["concluida", "concluido", "pronta", "pronto", "feita", "feito"],
    value: TODO_STATUS.DONE,
  },
  { keywords: ["pendente"], value: TODO_STATUS.PENDING },
];

// Identifica o comando no INÍCIO da frase: "título comprar leite" -> { type: "title", value: "comprar leite" }
// Retorna null quando a frase não começa com nenhuma palavra-chave.
export function parseVoiceCommand(spokenText) {
  const text = spokenText.normalize("NFC").trim();
  const normalized = normalizeText(text);

  for (const [type, keywords] of Object.entries(VOICE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.startsWith(`${keyword} `)) {
        // Fatia o texto original para preservar acentos e maiúsculas do valor
        const value = text.slice(keyword.length).trim();
        if (value) return { type, value };
      }
    }
  }

  return null;
}

// "em andamento" -> "IN_PROGRESS". Retorna "" se não reconhecer.
export function parseSpokenStatus(spokenText) {
  const text = normalizeText(spokenText);

  for (const option of SPOKEN_STATUSES) {
    if (option.keywords.some((keyword) => text.includes(keyword))) {
      return option.value;
    }
  }

  return "";
}