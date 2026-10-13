// Extrai uma mensagem legível de um erro do Axios
export function getErrorMessage(error, fallback = "Alguma coisa deu errado :(") {
  return error?.response?.data?.message || error?.message || fallback;
}