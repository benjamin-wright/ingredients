export default class URL {
    public path: string;
    public params: URLSearchParams;
    
    constructor(fullpath: string) {
        const [path, params] = fullpath.split('?');
        this.path = path;
        this.params = new URLSearchParams(params);
    }

    public addParam(key: string, value: string) {
        this.params.set(key, value);
    }

    public fullPath(): string {
        return `${this.path}?${this.params.toString()}`;
    }
}