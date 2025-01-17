import { articles, categories, subcategories, homeSettings } from './sqlite';

export const dbClient = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: async (column: string, value: any) => {
        switch (table) {
          case 'articles':
            return value ? articles.findOne(value) : articles.findAll();
          case 'categories':
            return categories.findAll();
          case 'subcategories':
            return subcategories.findAll();
          case 'home_settings':
            return homeSettings.findLatest();
          default:
            throw new Error(`Table ${table} not supported`);
        }
      },
      order: (column: string, { ascending = true }) => ({
        eq: async (column: string, value: any) => {
          switch (table) {
            case 'articles':
              return articles.findAll();
            case 'categories':
              return categories.findAll();
            case 'subcategories':
              return subcategories.findAll();
            default:
              throw new Error(`Table ${table} not supported`);
          }
        }
      })
    }),
    insert: async (data: any[]) => {
      switch (table) {
        case 'articles':
          return { data: articles.create(data[0]) };
        case 'categories':
          return { data: categories.create(data[0]) };
        case 'subcategories':
          return { data: subcategories.create(data[0]) };
        case 'home_settings':
          return { data: homeSettings.create(data[0]) };
        default:
          throw new Error(`Table ${table} not supported`);
      }
    },
    update: (data: any) => ({
      eq: async (column: string, value: any) => {
        switch (table) {
          case 'articles':
            return { data: articles.update(value, data) };
          case 'home_settings':
            return { data: homeSettings.update(value, data) };
          default:
            throw new Error(`Table ${table} not supported`);
        }
      }
    }),
    delete: () => ({
      eq: async (column: string, value: any) => {
        switch (table) {
          case 'articles':
            return articles.delete(value);
          case 'categories':
            return categories.delete(value);
          case 'subcategories':
            return subcategories.delete(value);
          default:
            throw new Error(`Table ${table} not supported`);
        }
      }
    })
  })
};