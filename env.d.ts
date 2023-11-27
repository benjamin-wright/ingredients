/// <reference types="vite/client" />

declare module 'absurd-sql' {
  export class SQLiteFS {
    constructor(fs: any, backend: any);
  }
}

declare module 'absurd-sql/dist/indexeddb-main-thread' {
  export function initBackend(worker: Worker): void;
}

declare module 'absurd-sql/dist/indexeddb-backend' {
  export default class IndexedDBBackend {
    constructor();
  }
}

declare module "@jlongster/sql.js" {
  export default function initSqlJs(options: any): Promise<any>;
}

