export default function VoiceControls({
  isSupported,
  isListening,
  onToggle,
  error,
  feedback,
  tips = [],
}) {
  if (!isSupported) {
    return (
      <p className="mb-4 text-xs text-gray-500">
        Comandos de voz não são compatíveis com este navegador. Tente usar o Chrome ou o Edge.
      </p>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg text-white font-medium text-sm flex items-center gap-2 cursor-pointer shadow-sm transition-all ${
          isListening
            ? "bg-red-500 animate-pulse ring-4 ring-red-200"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        🎙️ {isListening ? "Stop listening" : "Fill by voice"}
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {feedback && <p className="text-xs text-indigo-700">{feedback}</p>}

      {tips.length > 0 && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800">
          <p className="font-semibold mb-1">💡 Dicas de comandos de voz (diga-os em português):</p>
          <ul className="list-disc list-inside space-y-0.5 text-indigo-700">
            {tips.map((tip) => (
              <li key={tip.command}>
                <strong>"{tip.command}"</strong> — {tip.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}