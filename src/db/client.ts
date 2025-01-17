import { articles, categories, subcategories, homeSettings } from './sqlite';

class QueryBuilder {
  private table: string;
  private conditions: any[];
  private selectedColumns: string;
  private orderByColumn: string;
  private orderDirection: boolean;
  private limitCount: number;

  constructor(table: string) {
    this.table = table;
    this.conditions = [];
    this.selectedColumns = '*';
    this.orderByColumn = 'created_at';
    this.orderDirection = false; // descending by default
    this.limitCount = 0;
  }

  select(columns: string = '*') {
    this.selectedColumns = columns;
    return {
      eq: async (column: string, value: any) => {
        this.conditions.push({ column, value });
        return this.execute();
      },
      order: (column: string, { ascending = true }) => {
        this.orderByColumn = column;
        this.orderDirection = ascending;
        return {
          eq: async (column: string, value: any) => {
            this.conditions.push({ column, value });
            return this.execute();
          },
          limit: (count: number) => {
            this.limitCount = count;
            return {
              single: async () => {
                const result = await this.execute();
                return {
                  data: result.data?.[0] || null,
                  error: result.error
                };
              },
              maybeSingle: async () => {
                const result = await this.execute();
                return {
                  data: result.data?.[0] || null,
                  error: result.error
                };
              }
            };
          }
        };
      }
    };
  }

  private async execute() {
    try {
      let result;
      switch (this.table) {
        case 'articles':
          result = await articles.findAll();
          break;
        case 'categories':
          result = await categories.findAll();
          break;
        case 'subcategories':
          result = await subcategories.findAll();
          break;
        case 'home_settings':
          result = await homeSettings.findLatest();
          break;
        default:
          throw new Error(`Table ${this.table} not supported`);
      }

      // Apply conditions
      let filteredResult = Array.isArray(result) ? result : [result];
      this.conditions.forEach(({ column, value }) => {
        filteredResult = filteredResult.filter(item => item[column] === value);
      });

      // Apply ordering
      if (this.orderByColumn) {
        filteredResult.sort((a, b) => {
          if (this.orderDirection) {
            return a[this.orderByColumn] > b[this.orderByColumn] ? 1 : -1;
          }
          return a[this.orderByColumn] < b[this.orderByColumn] ? 1 : -1;
        });
      }

      // Apply limit
      if (this.limitCount > 0) {
        filteredResult = filteredResult.slice(0, this.limitCount);
      }

      return { data: filteredResult, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async insert(data: any[]) {
    try {
      let result;
      switch (this.table) {
        case 'articles':
          result = await articles.create(data[0]);
          break;
        case 'categories':
          result = await categories.create(data[0]);
          break;
        case 'subcategories':
          result = await subcategories.create(data[0]);
          break;
        case 'home_settings':
          result = await homeSettings.create(data[0]);
          break;
        default:
          throw new Error(`Table ${this.table} not supported`);
      }
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  update(data: any) {
    return {
      eq: async (column: string, value: any) => {
        try {
          let result;
          switch (this.table) {
            case 'articles':
              result = await articles.update(value, data);
              break;
            case 'home_settings':
              result = await homeSettings.update(value, data);
              break;
            default:
              throw new Error(`Table ${this.table} not supported`);
          }
          return { data: result, error: null };
        } catch (error) {
          return { data: null, error };
        }
      }
    };
  }

  delete() {
    return {
      eq: async (column: string, value: any) => {
        try {
          let result;
          switch (this.table) {
            case 'articles':
              result = await articles.delete(value);
              break;
            case 'categories':
              result = await categories.delete(value);
              break;
            case 'subcategories':
              result = await subcategories.delete(value);
              break;
            default:
              throw new Error(`Table ${this.table} not supported`);
          }
          return { data: result, error: null };
        } catch (error) {
          return { data: null, error };
        }
      }
    };
  }
}

export const dbClient = {
  from: (table: string) => {
    const builder = new QueryBuilder(table);
    return {
      select: (columns?: string) => builder.select(columns),
      insert: (data: any[]) => builder.insert(data),
      update: (data: any) => builder.update(data),
      delete: () => builder.delete(),
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string, file: File) => {
            // Simulate file storage with local URLs
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
    };
  }
};