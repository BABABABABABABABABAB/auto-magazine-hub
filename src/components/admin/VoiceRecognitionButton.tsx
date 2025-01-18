import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface VoiceRecognitionButtonProps {
  onTranscript: (text: string) => void;
}

export const VoiceRecognitionButton = ({ onTranscript }: VoiceRecognitionButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'fr-FR';

        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          onTranscript(transcript);
          setIsListening(false);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la reconnaissance vocale",
            variant: "destructive",
          });
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (!recognition) {
      toast({
        title: "Erreur",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur",
        variant: "destructive",
      });
      return;
    }

    setIsListening(true);
    recognition.start();

    // Arrêter automatiquement après 3 secondes
    setTimeout(() => {
      if (recognition) {
        recognition.stop();
      }
    }, 3000);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={startListening}
      disabled={isListening}
      className="shrink-0"
    >
      {isListening ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};