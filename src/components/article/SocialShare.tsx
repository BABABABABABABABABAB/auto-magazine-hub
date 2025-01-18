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
    <div className="flex gap-1 items-center bg-magazine-red rounded-full px-2 py-0.5">
      <div className="flex gap-0.5">
        {shareLinks.map((social) => (
          <Button
            key={social.name}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:text-white hover:bg-magazine-red/80"
            onClick={() => {
              if (social.onClick) {
                social.onClick();
              } else if (social.url) {
                window.open(social.url, "_blank");
              }
            }}
            title={`Partager sur ${social.name}`}
          >
            <social.icon className="h-3 w-3" />
          </Button>
        ))}
      </div>
    </div>
  );
};