// import sqlite3InitModule, { type OpfsDatabase, type SqlValue, type Sqlite3Static } from '@sqlite.org/sqlite-wasm';

import worker from './worker?worker&url';

type Query = {

}

export default class Database {
  private worker: Worker;
  private queries: Query[];

  constructor() {
    this.queries = [];
    this.worker = new Worker(worker, { type: 'module' });
    this.worker.onmessage = this.received.bind(this);
    this.worker.onerror = (event) => {
      console.error(event);
    }
    this.worker.onmessageerror = (event) => {
      console.error(event);
    }

  }

  private received(event: MessageEvent<any>) {
    console.log(event.data);
  }
}

// export default class Database {
//   private db: OpfsDatabase;

//   static getSqliteDB(): Promise<OpfsDatabase> {
//     return sqlite3InitModule({
//       print: console.log,
//       printErr: console.error,
//     }).then((sqlite3: Sqlite3Static) => {
//       const hasOPFS = 'opfs' in sqlite3;
  
//       // throw an error if opfs is not available
//       if (!hasOPFS) {
//         throw new Error('opfs not available');
//       }
  
//       return new sqlite3.oo1.OpfsDb('nomnom.db', 'c');
//     });
//   }

//   constructor(db: OpfsDatabase) {
//     this.db = db;
//   }

//   async init(migrations: string[]): Promise<void> {
//     await this.initMigrations();

//     migrations.forEach((sql: string, n: number) => {
//       if (!this.hasMigration(n)) {
//         this.runMigration(n, sql);
//       }
//     });
//   }

//   private initMigrations() {
//     this.db.exec(`
//       CREATE TABLE IF NOT EXISTS migrations (
//         id INTEGER PRIMARY KEY,
//         hash TEXT NOT NULL
//       );
//     `);
//   }

//   private hasMigration(n: number): boolean {
//     const resultRows: SqlValue[][] = [];

//     this.db.exec(`SELECT id FROM migrations WHERE id == ${n}`, {
//       resultRows: resultRows,
//     });

//     return resultRows.length > 0;
//   }

//   private async runMigration(n: number, sql: string): Promise<void> {
//     this.db.transaction((t: OpfsDatabase) => {
//       t.exec(sql);
//       t.exec(`INSERT INTO migrations (id) VALUES (${n})`);
//     });
//   }

//   exec<T>(sql: string, reader: (rows: SqlValue[]) => T): T[] {
//     const resultRows: SqlValue[][] = [];
    
//     this.db.exec(sql, {
//       resultRows: resultRows,
//     });

//     const output: T[] = [];

//     for (const row of resultRows) {
//       output.push(reader(row))
//     }

//     return output;
//   }
// }
