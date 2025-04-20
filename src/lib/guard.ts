import { PrimerGuardConfig, ImmunityEvent, PrimerGuardInterface } from './types';

export class PrimerGuard implements PrimerGuardInterface {
    public immuneLog: ImmunityEvent[];
    public blocklist: string[];

    constructor(config?: PrimerGuardConfig) {
        this.immuneLog = [];
        this.blocklist = config?.blocklist || ['malware.com', 'malicious-cdn.com'];
    }

    public initialize(): void {
        this._overrideFetch();
        this._initDOMObserver();
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

        window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
            if (this.blocklist.some(domain => url.includes(domain))) {
                this.immuneLog.push({ type: 'blocked_fetch', url });
                return new Response(JSON.stringify({ error: "Blocked by PrimerGuard" }), { status: 403 });
            }
            return originalFetch.call(window, input, init);
        };
    }

    private _captureErrors(): void {
        window.onerror = ((event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error | null) => {
            this.immuneLog.push({
                type: 'js_error',
                message: String(event),
                source: source || 'unknown',
                line: lineno || 0,
                column: colno || 0,
                error: error?.stack || 'N/A'
            });
            return true;
        }) as OnErrorEventHandler;
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
