import LocalDatabase from 'better-sqlite3';
import migrations from './migrations';

export class MockDatabase {
  private db: LocalDatabase;
  
  constructor() {
    this.db = new LocalDatabase(':memory:');
    this.db.exec(`
        PRAGMA journal_mode=MEMORY;
        PRAGMA page_size=8192;
        PRAGMA foreign_keys=ON;
    `);

    migrations.forEach(m => this.db.exec(m));
  }

  async query<T>(sql: string, bind?: any[], reader?: (row: any[]) => T): Promise<T[]> {
    let statement = this.db.prepare(sql)
    
    if (bind) {
      statement = statement.bind(bind);
    }

    if (reader) {
      return statement.raw(true).all().map(reader);
    }

    return statement.run();
  }
}