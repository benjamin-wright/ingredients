import { sqlite3Worker1Promiser } from '@sqlite.org/sqlite-wasm';
import hash from '@/utils/hash';

import migration0 from './migrations/migration-0.sql?raw';

declare module '@sqlite.org/sqlite-wasm' {
  export function sqlite3Worker1Promiser(...args: any): any
}

type ExecOptions = {
  dbId: any,
  sql: string,
  bind?: any[],
  callback?: (result: any) => any,
}

type OpenOptions = {
  filename: string,
}

type Promiser = {
  (
    action: string, options: OpenOptions | ExecOptions & {dbId: any}
  ): Promise<any>
}

class Database {
  private promiser: Promiser;
  private dbId: any;

  constructor() {
    this.promiser = () => Promise.reject('Database not initialized');
  }

  async init(): Promise<void> {
    console.log('Loading and initializing SQLite3 module...');

    this.promiser = await new Promise<any>((resolve) => {
      const _promiser = sqlite3Worker1Promiser({
        onready: () => {
          resolve(_promiser);
        },
      });
    });

    console.log('Opening database...');

    const response = await this.promiser('open', {
      filename: 'file:ingredients.sqlite3?vfs=opfs',
    });
    const { dbId } = response;
    this.dbId = dbId;

    console.log(
      'OPFS is available, created persisted database at',
      response.result.filename.replace(/^file:(.*?)\?vfs=opfs$/, '$1'),
    );
  }

  async migrate(migrations: string[]): Promise<void> {
    console.info('Initializing migrations...');
    await this.initMigrations();

    for (const [n, sql] of migrations.entries()) {
      if (!await this.hasMigration(n, sql)) {
        console.info(`Running migration ${n}...`);
        await this.runMigration(n, sql);
      } else {
        console.info(`Skipping migration ${n}...`);
      }
    }

    console.info('Done migrating.');
  }

  async exec<T>(sql: string, bind?: any[], reader?: (rows: any[]) => T): Promise<T[]> {
    const resultRows: any[] = [];

    await this.promiser('exec', {
      dbId: this.dbId,
      sql: sql,
      bind: bind,
      callback: (result: any) => {
        if (result.row) { resultRows.push(result.row) }
      }
    });

    const output: T[] = [];

    if (!reader) {
      return output;
    }
    
    for (const row of resultRows) {
      output.push(reader(row))
    }

    return output;
  }

  private async initMigrations(): Promise<void> {
    await this.promiser('exec', {
      dbId: this.dbId,
      sql: `
        CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY,
          hash INTEGER NOT NULL
        );
      `
    });
  }

  private async hasMigration(n: number, sql: string): Promise<boolean> {
    const rows = await this.exec(
      'SELECT id, hash FROM migrations WHERE id == ?',
      [n],
      (row) => ({ id: row[0] as number, hash: row[1] as number }),
    );

    if (rows.length == 0) {
      return false;
    }

    const row = rows[0];

    if (row.hash != hash(sql)) {
      throw new Error(
        `Migration ${n} has already been run, but the hash does not match.`
      );
    }

    return true;
  }

  private async runMigration(n: number, sql: string): Promise<void> {
    await this.promiser('exec', {
      dbId: this.dbId,
      sql: sql,
    });

    await this.promiser('exec', {
      dbId: this.dbId,
      sql: `INSERT INTO migrations (id, hash) VALUES (?, ?)`,
      bind: [n, hash(sql)],
    });
  }
}

const database = (async () => {
  const db = new Database();
  await db.init();
  await db.migrate([migration0]);
  return db;
})();

export async function query<T>(sql: string, bind?: any[], reader?: (rows: any[]) => T): Promise<T[]> {
  return database.then(db => db.exec(sql, bind, reader));
}