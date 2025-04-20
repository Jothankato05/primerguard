import { PrimerGuardConfig, ImmunityEvent, PrimerGuardInterface } from './types';

export class PrimerGuard implements PrimerGuardInterface {
    public immuneLog: ImmunityEvent[];
    public blocklist: string[];

    constructor(config: PrimerGuardConfig = {}) {
        this.immuneLog = [];
        this.blocklist = config.blocklist || ['malware.com', 'api.stealmydata.io'];
        this._initDOMObserver();
        this._overrideFetch();
        this._captureErrors();
    }

    private _initDOMObserver(): void {
        const observer = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && (node as Element).tagName === "SCRIPT") {
                        const scriptNode = node as HTMLScriptElement;
                        const isInjected = !scriptNode.src.includes(window.location.hostname);
                        if (isInjected) {
                            this.immuneLog.push({ type: 'script_block', node });
                            if (node.parentNode) {
                                node.parentNode.removeChild(node);
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    private _overrideFetch(): void {
        const originalFetch = window.fetch;

        window.fetch = async (...args: [RequestInfo | URL, RequestInit?]): Promise<Response> => {
            const url = args[0] instanceof Request ? args[0].url : String(args[0]);
            if (this.blocklist.some(domain => url.includes(domain))) {
                this.immuneLog.push({ type: 'blocked_fetch', url });
                return new Response(JSON.stringify({ error: "Blocked by PrimerGuard" }), { status: 403 });
            }
            return originalFetch(...args);
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
