export type QueryResult = {
    columns: string[];
    values: any[][];
}

export type ExecResponse = {
    type: 'exec';
    requestId: number;
    result: QueryResult[];
    error?: string;
}

export type ExecRequest = {
    type: 'exec';
    requestId: number;
    sql: string;
    bind?: any[];
}