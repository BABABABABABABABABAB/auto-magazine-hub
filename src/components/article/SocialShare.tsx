import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareProps {
  url: string;
  title: string;
  imageUrl: string;
}

export const SocialShare = ({ url, title, imageUrl }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedImage = encodeURIComponent(imageUrl);

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Instagram",
      icon: Instagram,
      onClick: () => {
        // Instagram doesn't support direct sharing via URL
        alert("Pour partager sur Instagram, veuillez copier le lien de l'article.");
      },
    },
  ];

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm font-medium text-gray-700">Partager :</span>
      <div className="flex gap-2">
        {shareLinks.map((social) => (
          <Button
            key={social.name}
            variant="outline"
            size="icon"
            onClick={() => {
              if (social.onClick) {
                social.onClick();
              } else if (social.url) {
                window.open(social.url, "_blank");
              }
            }}
            title={`Partager sur ${social.name}`}
          >
            <social.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};