import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';
import hash from '@/utils/hash';
import DBWorker from './database-worker.ts?worker';
import { type ExecResponse, type ExecRequest } from './request-types';

import migration00 from './migrations/migration-00.sql?raw';
import migration01 from './migrations/migration-01.sql?raw';
import migration02 from './migrations/migration-02.sql?raw';
import migration03 from './migrations/migration-03.sql?raw';

type Request<T> = {
  resolve: (value: T[]) => void;
  reject: (reason?: any) => void;
  reader?: (row: any[]) => T;
}

class Database {
  private queryCounter = 0;
  private worker: Worker;
  private initPromise;
  private initResolver: () => void;
  private requests: Record<number, Request<any>> = {};

  constructor() {
    this.initResolver = () => {};
    this.initPromise = new Promise<void>((resolve) => {
      this.initResolver = resolve;
    });

    this.worker = new DBWorker();
    this.worker.onmessage = this.receiveMessage.bind(this);
    this.worker.onerror = this.receieveError.bind(this);

    initBackend(this.worker);
  }

  async init(): Promise<void> {
    console.log('waiting for init...');
    await this.initPromise;
    console.log('ready');
  }

  private receiveMessage(event: MessageEvent<any>) {
    switch (event.data.type) {
      case 'exec': {
        const response = event.data as ExecResponse;
        const request = this.requests[response.requestId];

        if (response.error) {
          request.reject(response.error);
          return;
        }

        if (!request) {
          console.error('Unknown request id', response.requestId);
          return;
        }

        if (response.result) {
          const output: any[][] = [];
          if (request.reader) {
            for (const result of response.result) {
              for (const row of result.values) {
                output.push(request.reader(row));
              }
            }
          } else {
            for (const result of response.result) {
              output.push(...result.values);
            }
          }
          request.resolve(output);
        } else {
          request.resolve([]);
        }

        break;
      }
      case '__absurd:spawn-idb-worker': {
        this.initResolver();
        break;
      }
      default: {
        console.error('Unknown message type', event.data);
      }
    }
  }

  private receieveError(event: ErrorEvent) {
    console.error(event);
  }

  async reset(): Promise<void> {
    this.worker.postMessage({ type: 'close' });
    const request = window.indexedDB.deleteDatabase('db.sqlite');
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Error deleting database'));
      request.onblocked = () => reject(new Error('Blocked deleting database'));
    });
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

  exec<T>(sql: string, bind?: any[], reader?: (row: any[]) => T): Promise<T[]> {
    const id = this.queryCounter++;
    return new Promise<T[]>((resolve, reject) => {
      this.requests[id] = { resolve, reject, reader };
      const request: ExecRequest = { type: 'exec', requestId: id, sql, bind };
      this.worker.postMessage(request);
    });
  }

  private async initMigrations(): Promise<void> {
    await this.exec('CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY, hash INTEGER NOT NULL);');
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
    await this.exec(sql);
    await this.exec(
      'INSERT INTO migrations (id, hash) VALUES (?, ?)',
      [n, hash(sql)],
    );
  }
}

const database = (async () => {
  const db = new Database();
  await db.init();
  return db;
})();

const migrated = database.then(async (db) => {
  await db.migrate([migration00, migration01, migration02, migration03]);
  return db;
});

export async function query<T>(sql: string, bind?: any[], reader?: (row: any[]) => T): Promise<T[]> {
  return migrated.then(db => db.exec(sql, bind, reader));
}

export async function reset(): Promise<void> {
  return database.then(db => db.reset());
}
