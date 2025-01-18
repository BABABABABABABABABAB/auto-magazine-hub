import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  onUrlChange: (url: string) => void;
  onSetLink: () => void;
  isActive: boolean;
}

export const LinkDialog = ({
  open,
  onOpenChange,
  url,
  onUrlChange,
  onSetLink,
  isActive
}: LinkDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un lien</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={onSetLink}>
              {isActive ? 'Mettre à jour le lien' : 'Créer le lien'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};