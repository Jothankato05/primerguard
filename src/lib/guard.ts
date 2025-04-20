import { PrimerGuardConfig, ImmunityEvent, PrimerGuardInterface } from './types';

export class PrimerGuard implements PrimerGuardInterface {
    public immuneLog: ImmunityEvent[];
    public blocklist: string[];

    constructor(config: PrimerGuardConfig = {}) {
        this.immuneLog = [];
        this.blocklist = config.blocklist || [];
    }

    public initialize(): void {
        this._overrideFetch();
        this._initDOMObserver();
        this._captureErrors();
    }

    private _initDOMObserver(): void {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLScriptElement) {
                        const scriptNode = node as HTMLScriptElement;
                        if (this.blocklist.some(domain => scriptNode.src.includes(domain))) {
                            this.immuneLog.push({ type: 'blocked_script', url: scriptNode.src });
                            if (scriptNode.parentNode) {
                                scriptNode.parentNode.removeChild(scriptNode);
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    private _overrideFetch(): void {
        const originalFetch = window.fetch;

        window.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
            const url = input instanceof Request ? input.url : input.toString();

            if (this.blocklist.some(domain => url.includes(domain))) {
                this.immuneLog.push({ type: 'blocked_fetch', url });
                return new Response(null, { status: 403 });
            }

            return originalFetch.call(window, input, init);
        }) as typeof fetch;
    }

    public async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        const url = input instanceof Request ? input.url : input.toString();

        if (this.blocklist.some(domain => url.includes(domain))) {
            this.immuneLog.push({ type: 'blocked_fetch', url });
            return new Response(null, { status: 403 });
        }

        return window.fetch(input, init);
    }

    private _captureErrors(): void {
        interface ErrorEventWithError extends Event {
            error?: Error;
            message?: string;
        }

        interface UnhandledRejectionEvent extends Event {
            reason?: Error | any;
        }

        window.addEventListener('error', (event: ErrorEventWithError) => {
            this.immuneLog.push({
                type: 'error',
                message: event.error?.message || event.message || 'Unknown error'
            });
        });

        window.addEventListener('unhandledrejection', (event: UnhandledRejectionEvent) => {
            const reason = event.reason;
            this.immuneLog.push({
                type: 'unhandled_rejection',
                message: reason?.message || String(reason)
            });
        });
    }

    public getImmuneLog(): ImmunityEvent[] {
        return this.immuneLog;
    }

    public quarantineNode(node: Node): void {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }

    public patch(label: string, fn: () => void): void {
        this.immuneLog.push({ type: 'patch_applied', label });
        fn();
    }
}

export default PrimerGuard;
