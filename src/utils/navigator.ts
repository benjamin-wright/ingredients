import { type Router } from 'vue-router';
import URL from './URL';

export class Navigator {
    private router: Router;
    private default: string;
    private returnTo: string | null = null;

    constructor(options: {
        router: Router,
        default: string,
    }) {
        this.router = options.router;
        this.default = options.default;

        let returnTo = this.router.currentRoute.value.query.return;
        if (Array.isArray(returnTo)) {
          returnTo = returnTo[0];
        }
    
        this.returnTo = returnTo;
    }

    get isReturner(): boolean {
        return this.returnTo !== null;
    }

    navigate(params?: Record<string, string>) {
        if (this.returnTo) {
          const url = new URL(this.returnTo);
    
          if (params) {
            for (const key in params) {
              url.addParam(key, params[key]);
            }
          }
          this.router.push(url.fullPath());
        } else {
          this.router.push(this.default);
        }
      }
}