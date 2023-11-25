import { sqlite3Worker1Promiser, type ExecOptions } from '@sqlite.org/sqlite-wasm';

declare module '@sqlite.org/sqlite-wasm' {
  export function sqlite3Worker1Promiser(...args: any): any
}

type Promiser = {
  (
    action: string, options: ExecOptions & {dbId: any}
  ): Promise<any>
}

export default class Database {
  private promiser: Promiser;
  private dbId: any;

  constructor() {
    this.promiser = () => Promise.reject('Database not initialized');
  }

  async init(): Promise<void> {
    console.log('Loading and initializing SQLite3 module...');

    const promiser = await new Promise<any>((resolve) => {
      const _promiser = sqlite3Worker1Promiser({
        onready: () => {
          resolve(_promiser);
        },
      });
    });

    console.log('Opening database...');

    const response = await promiser('open', {
      filename: 'file:ingredients.sqlite3?vfs=opfs',
    });
    const { dbId } = response;
    this.dbId = dbId;

    console.log(
      'OPFS is available, created persisted database at',
      response.result.filename.replace(/^file:(.*?)\?vfs=opfs$/, '$1'),
    );
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
