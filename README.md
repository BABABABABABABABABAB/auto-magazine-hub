# Auto Magazine Hub

Un site web de magazine automobile moderne avec un système de gestion de contenu complet.

## Fonctionnalités

- 🚗 Articles automobiles avec catégories et sous-catégories
- 📱 Design responsive
- 🖼️ Bannière principale personnalisable
- 📊 Interface d'administration complète
- 🔍 Filtrage par catégories
- 📄 Pagination des articles
- 🖼️ Compression automatique des images
- 📱 Bannière verticale sur les pages d'articles

## Comment remixer ce projet ?

1. Cliquez sur le bouton "Remix" en haut à droite de l'interface Lovable
2. Un nouveau projet sera créé avec une copie de tout le code
3. Suivez les étapes de configuration ci-dessous

## Configuration requise

1. **Base de données Supabase**
   - Les tables seront automatiquement créées lors du remix
   - Vérifiez que toutes les tables sont présentes dans l'éditeur SQL
   - Les politiques RLS sont déjà configurées pour un accès public

2. **Stockage Supabase**
   - Un bucket "ui_images" sera créé automatiquement
   - Vérifiez qu'il est bien configuré en public

3. **Variables d'environnement**
   - Les variables Supabase seront automatiquement configurées

## Structure du projet

```
src/
├── components/         # Composants réutilisables
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

## Support

Si vous avez des questions sur ce template, rejoignez la [communauté Lovable sur Discord](https://discord.gg/lovable).

## Licence

Ce projet est sous licence MIT. Vous pouvez l'utiliser librement pour vos projets personnels ou commerciaux.