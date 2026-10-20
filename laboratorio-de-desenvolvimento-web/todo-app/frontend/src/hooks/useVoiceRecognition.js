import { useState, useEffect, useRef } from "react";

// A API é prefixada no Chrome/Edge (webkitSpeechRecognition)
const SpeechRecognitionApi =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : undefined;

const ERROR_MESSAGES = {
  "not-allowed": "Acesso ao microfone foi negado",
  "audio-capture": "Nenhum microfone foi encontrado",
  "no-speech": "Nenhuma fala foi detectada",
  network: "Erro de rede durante a reconhecimento de voz",
};

export function useVoiceRecognition({ onTranscript, lang = "pt-BR" } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef(null);
  const onTranscriptRef = useRef(onTranscript);

  // Mantém sempre a versão mais recente do callback, sem recriar o reconhecedor
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  });

  useEffect(() => {
    if (!SpeechRecognitionApi) return;

    const recognition = new SpeechRecognitionApi();
    recognition.lang = lang;
    recognition.continuous = true; // continua ouvindo após cada frase
    recognition.interimResults = false; // só entrega frases finalizadas

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim();
          if (transcript) onTranscriptRef.current?.(transcript);
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") return;
      setVoiceError(ERROR_MESSAGES[event.error] || `Erro de voz: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [lang]);

  // Liga e desliga o microfone
  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setVoiceError("");

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setVoiceError("Não foi possível iniciar o microfone");
    }
  };

  return {
    isSupported: Boolean(SpeechRecognitionApi),
    isListening,
    voiceError,
    toggleListening,
  };
}