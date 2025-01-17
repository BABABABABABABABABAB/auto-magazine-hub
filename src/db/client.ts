import { articles, categories, subcategories, homeSettings } from './sqlite';

export const dbClient = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: async (column: string, value: any) => {
        switch (table) {
          case 'articles':
            const articleResult = value ? await articles.findOne(value) : await articles.findAll();
            return { data: articleResult, error: null };
          case 'categories':
            const categoryResult = await categories.findAll();
            return { data: categoryResult, error: null };
          case 'subcategories':
            const subcategoryResult = await subcategories.findAll();
            return { data: subcategoryResult, error: null };
          case 'home_settings':
            const settingsResult = await homeSettings.findLatest();
            return { data: settingsResult, error: null };
          default:
            throw new Error(`Table ${table} not supported`);
        }
      },
      order: (column: string, { ascending = true }) => ({
        eq: async (column: string, value: any) => {
          switch (table) {
            case 'articles':
              return { data: await articles.findAll(), error: null };
            case 'categories':
              return { data: await categories.findAll(), error: null };
            case 'subcategories':
              return { data: await subcategories.findAll(), error: null };
            default:
              throw new Error(`Table ${table} not supported`);
          }
        },
        limit: (count: number) => ({
          single: async () => {
            switch (table) {
              case 'home_settings':
                return { data: await homeSettings.findLatest(), error: null };
              default:
                throw new Error(`Table ${table} does not support limit.single()`);
            }
          },
          maybeSingle: async () => {
            switch (table) {
              case 'articles':
                return { data: await articles.findLatest(), error: null };
              default:
                throw new Error(`Table ${table} does not support limit.maybeSingle()`);
            }
          }
        })
      })
    }),
    insert: async (data: any[]) => {
      try {
        switch (table) {
          case 'articles':
            return { data: await articles.create(data[0]), error: null };
          case 'categories':
            return { data: await categories.create(data[0]), error: null };
          case 'subcategories':
            return { data: await subcategories.create(data[0]), error: null };
          case 'home_settings':
            return { data: await homeSettings.create(data[0]), error: null };
          default:
            throw new Error(`Table ${table} not supported`);
        }
      } catch (error) {
        return { data: null, error };
      }
    },
    update: (data: any) => ({
      eq: async (column: string, value: any) => {
        try {
          switch (table) {
            case 'articles':
              return { data: await articles.update(value, data), error: null };
            case 'home_settings':
              return { data: await homeSettings.update(value, data), error: null };
            default:
              throw new Error(`Table ${table} not supported`);
          }
        } catch (error) {
          return { data: null, error };
        }
      }
    }),
    delete: () => ({
      eq: async (column: string, value: any) => {
        try {
          switch (table) {
            case 'articles':
              return { data: await articles.delete(value), error: null };
            case 'categories':
              return { data: await categories.delete(value), error: null };
            case 'subcategories':
              return { data: await subcategories.delete(value), error: null };
            default:
              throw new Error(`Table ${table} not supported`);
          }
        } catch (error) {
          return { data: null, error };
        }
      }
    }),
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => {
          // Simuler le stockage de fichier en local
          console.log('Storage upload simulated:', { bucket, path, file });
          const fakeUrl = `http://localhost:3000/storage/${bucket}/${path}`;
          return { data: { publicUrl: fakeUrl }, error: null };
        },
        getPublicUrl: (path: string) => {
          const fakeUrl = `http://localhost:3000/storage/${bucket}/${path}`;
          return { data: { publicUrl: fakeUrl } };
        }
      })
    }
  })
};