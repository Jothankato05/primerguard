class PrimerGuard {
    constructor(config = {}) {
        this.immuneLog = [];
        this.blocklist = config.blocklist || ['malware.com', 'api.stealmydata.io'];
        this._initDOMObserver();
        this._overrideFetch();
        this._captureErrors();
    }

    _initDOMObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === "SCRIPT") {
                        const isInjected = !node.src.includes(window.location.hostname);
                        if (isInjected) {
                            this.immuneLog.push({ type: 'script_block', node });
                            node.remove();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    _overrideFetch() {
        const originalFetch = window.fetch;
        const self = this;

        window.fetch = async function (...args) {
            if (self.blocklist.some(domain => args[0].includes(domain))) {
                self.immuneLog.push({ type: 'blocked_fetch', url: args[0] });
                return new Response(JSON.stringify({ error: "Blocked by PrimerGuard" }), { status: 403 });
            }
            return originalFetch(...args);
        };
    }

    _captureErrors() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            this.immuneLog.push({
                type: 'js_error',
                message: msg,
                source: url,
                line: lineNo,
                column: columnNo,
                error: error?.stack || 'N/A'
            });
            return true;
        };
    }

    getImmuneLog() {
        return this.immuneLog;
    }

    quarantineNode(node) {
        node?.remove?.();
    }

    patch(label, fn) {
        this.immuneLog.push({ type: 'patch_applied', label });
        fn();
    }
}

export default PrimerGuard;
