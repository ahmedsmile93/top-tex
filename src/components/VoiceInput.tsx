import { useEffect, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

type VoiceInputProps = {
  onTranscript: (text: string) => void;
};

type SpeechRecognitionType =
  | typeof window.SpeechRecognition
  | typeof window.webkitSpeechRecognition
  | undefined;

type SpeechRecognitionInstance = InstanceType<
  NonNullable<SpeechRecognitionType>
>;

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};
export default function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] =
    useState<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SpeechRecognition: SpeechRecognitionType =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const instance = new SpeechRecognition();
      instance.lang = "fr-FR";
      instance.interimResults = false;
      instance.maxAlternatives = 1;

      instance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      instance.onerror = () => {
        setIsListening(false);
      };

      instance.onend = () => {
        setIsListening(false);
      };

      setRecognition(instance);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <button
      onClick={toggleListening}
      title={isListening ? "Arrêter" : "Parler"}
      className="mr-1 mt-1.5 p-0 bg-transparent border-none cursor-pointer text-2xl focus:outline-none"
    >
      {isListening ? (
        <FaMicrophoneSlash className="text-red-600" />
      ) : (
        <FaMicrophone />
      )}
    </button>
  );
}
