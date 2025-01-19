# Auto Magazine Hub

Un site web de magazine automobile moderne avec un système de gestion de contenu complet.

## Guide de collaboration

### Pour les nouveaux collaborateurs

1. **Accéder au projet**
   - Connectez-vous à votre compte Lovable
   - Accédez à l'URL du projet partagée par votre équipe
   - Cliquez sur le bouton "Remix" en haut à droite
   - Un nouveau projet sera créé avec une copie de tout le code

2. **Configuration de votre environnement**
   - Créez un nouveau projet sur [Supabase](https://supabase.com)
   - Copiez l'URL et la clé anon de votre projet
   - Configurez les variables d'environnement dans Lovable :
     - VITE_SUPABASE_URL
     - VITE_SUPABASE_ANON_KEY

3. **Configuration Supabase**
   - Les tables seront automatiquement créées
   - Créez un bucket "ui_images" en accès public
   - Activez la compression automatique des images

4. **Vérification**
   - Testez que vous pouvez accéder à l'interface d'administration
   - Vérifiez que vous pouvez créer/modifier des articles
   - Testez le téléchargement d'images

## Structure du projet

```
src/
├── components/         # Composants réutilisables
│   ├── ui/            # Composants UI de base (shadcn/ui)
│   ├── home/          # Composants de la page d'accueil
│   ├── article/       # Composants des pages d'articles
│   └── admin/         # Composants de l'interface admin
├── pages/             # Pages principales
├── hooks/             # Hooks personnalisés
└── integrations/      # Intégration Supabase
```

## Technologies utilisées

- React + Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- TanStack Query

## Personnalisation

1. **Couleurs**
   - Les couleurs principales sont définies dans `tailwind.config.ts`
   - Palette actuelle :
     ```
     magazine-black: "#000000"
     magazine-red: "#FF0000"
     magazine-gray: "#808080"
     magazine-background: "#f3f3f3"
     ```

2. **Composants**
   - Les composants UI sont basés sur shadcn/ui
   - Facilement personnalisables via Tailwind CSS

3. **Images**
   - Taille maximale recommandée : 1920x1080px
   - Compression automatique à 90ko
   - Formats supportés : JPG, PNG, WebP

4. **Bannières**
   - Bannière principale : 1920x400px recommandé
   - Bannière verticale : 300x600px recommandé

## Dépendances principales

```json
{
  "@supabase/supabase-js": "^2.47.12",
  "@tanstack/react-query": "^5.56.2",
  "browser-image-compression": "^2.0.2",
  "date-fns": "^3.6.0",
  "lucide-react": "^0.462.0"
}
```

## Support

Si vous avez des questions sur ce template :
1. Consultez la [documentation Lovable](https://docs.lovable.dev)
2. Rejoignez la [communauté Lovable sur Discord](https://discord.gg/lovable)
3. Consultez les [exemples de projets similaires](https://lovable.dev/templates)

## Licence

Ce projet est sous licence MIT. Vous pouvez l'utiliser librement pour vos projets personnels ou commerciaux.
