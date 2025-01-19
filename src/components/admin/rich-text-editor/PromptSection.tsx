import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";

interface PromptSectionProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  generating: boolean;
}

export const PromptSection = ({
  prompt,
  onPromptChange,
  onGenerate,
  generating
}: PromptSectionProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Label htmlFor="prompt">Prompt pour générer du contenu</Label>
        <Textarea
          id="prompt"
          placeholder="Décrivez l'article que vous souhaitez générer..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
      </div>
      <Button
        onClick={onGenerate}
        disabled={generating}
        className="self-end"
      >
        {generating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Génération...
          </>
        ) : (
          "Générer"
        )}
      </Button>
    </div>
  );
};