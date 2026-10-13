export const TODO_STATUS = {
  PENDING: "PENDENTE",
  IN_PROGRESS: "EM_ANDAMENTO",
  DONE: "CONCLUIDO",
};

// Ordem em que os status aparecem na interface
export const STATUS_ORDER = [
  TODO_STATUS.PENDING,
  TODO_STATUS.IN_PROGRESS,
  TODO_STATUS.DONE,
];

export const STATUS_LABELS = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluído",
};

export const STATUS_BADGE_CLASSES = {
  PENDING: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-700",
};