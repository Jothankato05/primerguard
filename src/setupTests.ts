// Import fetch polyfill
import 'whatwg-fetch';

// Mock fetch API
const originalFetch = window.fetch;
window.fetch = jest.fn(() => {
  return Promise.resolve(new Response());
}) as jest.Mock;

// Make sure to restore original fetch after tests
afterAll(() => {
  window.fetch = originalFetch;
});

// Mock MutationObserver
class MockMutationObserver implements MutationObserver {
    private callback: MutationCallback;

    constructor(callback: MutationCallback) {
        this.callback = callback;
    }

    observe(target: Node): void {
        const originalAppendChild = target.appendChild.bind(target);
        target.appendChild = <T extends Node>(node: T): T => {
            const result = originalAppendChild(node) as T;
            const record: MutationRecord = {
                type: 'childList',
                target: target,
                addedNodes: [node] as unknown as NodeList,
                removedNodes: [] as unknown as NodeList,
                previousSibling: null,
                nextSibling: null,
                attributeName: null,
                attributeNamespace: null,
                oldValue: null
            };
            this.callback([record], this);
            return result;
        };
    }

    disconnect(): void {}

    takeRecords(): MutationRecord[] {
        return [];
    }
}

global.MutationObserver = MockMutationObserver;
