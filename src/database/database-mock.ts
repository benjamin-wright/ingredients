import BetterSqlite3 from 'better-sqlite3';
import migrations from './migrations';

export class MockDatabase {
  private db: BetterSqlite3.Database;
  
  constructor() {
    this.db = new BetterSqlite3(':memory:');
    this.db.exec(`
        PRAGMA journal_mode=MEMORY;
        PRAGMA page_size=8192;
        PRAGMA foreign_keys=ON;
    `);

    migrations.forEach(m => this.db.exec(m));
  }

  async query<T>(sql: string, bind?: any[], reader?: (row: any[]) => T): Promise<T[]> {
    let statement = this.db.prepare<any[]>(sql)
    
    if (bind) {
      statement = statement.bind(bind);
    }

    if (reader) {
      return statement.raw(true).all().map<any>((value: unknown) => reader(value as any[]));
    }

    statement.run();
    return [];
  }
}