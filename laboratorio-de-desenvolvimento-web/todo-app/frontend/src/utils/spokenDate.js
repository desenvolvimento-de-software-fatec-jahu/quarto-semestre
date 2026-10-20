import { toDateInputValue } from "./formatDate.js";
import { normalizeText } from "./normalizeText.js";

// Números falados por extenso que o reconhecedor de voz pode devolver
const SPOKEN_NUMBERS = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
};

function addDays(baseDate, days) {
  const result = new Date(baseDate);
  result.setDate(result.getDate() + days);
  return result;
}

// Converte uma data falada em "YYYY-MM-DD". Retorna "" se não entender.
// Exemplos: "hoje", "amanhã", "depois de amanhã", "daqui a 3 dias", "daqui a cinco dias"
export function parseSpokenDate(spokenText, baseDate = new Date()) {
  const text = normalizeText(spokenText);

  // "depois de amanhã" precisa ser verificado antes de "amanhã"
  if (text.includes("depois de amanha")) {
    return toDateInputValue(addDays(baseDate, 2));
  }

  if (text.includes("amanha")) {
    return toDateInputValue(addDays(baseDate, 1));
  }

  if (text.includes("hoje")) {
    return toDateInputValue(baseDate);
  }

  const match = text.match(/daqui a (\d+|[a-z]+) dias?/);
  if (match) {
    const amount = /^\d+$/.test(match[1])
      ? parseInt(match[1], 10)
      : SPOKEN_NUMBERS[match[1]];

    if (amount !== undefined) {
      return toDateInputValue(addDays(baseDate, amount));
    }
  }

  return "";
}