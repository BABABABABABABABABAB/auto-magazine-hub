import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "./ImageUpload";

const formSchema = z.object({
  imageUrl: z.string().min(1, "L'URL de l'image est requise"),
  linkUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface VerticalBannerFormProps {
  defaultValues?: {
    imageUrl: string;
    linkUrl?: string;
  };
}

export function VerticalBannerForm({ defaultValues }: VerticalBannerFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: defaultValues?.imageUrl || "",
      linkUrl: defaultValues?.linkUrl || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase
        .from("vertical_banner_settings")
        .insert([
          {
            image_url: values.imageUrl,
            link_url: values.linkUrl,
            is_active: true,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La bannière a été mise à jour",
      });

      queryClient.invalidateQueries({ queryKey: ["vertical-banner"] });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la bannière",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image de la bannière</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  onUpload={(url) => form.setValue("imageUrl", url)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL du lien (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Mettre à jour la bannière</Button>
      </form>
    </Form>
  );
}