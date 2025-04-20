// Mock fetch API
global.fetch = jest.fn((url: string): Promise<Response> => {
  if (url.includes('malware.com')) {
    return Promise.resolve(new Response(JSON.stringify({ error: "Blocked by PrimerGuard" }), { status: 403 }));
  }
  return Promise.resolve(new Response());
}) as jest.Mock;

// Mock MutationObserver
class MockMutationObserver implements MutationObserver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(target: Node, options?: MutationObserverInit): void {}
  disconnect(): void {}
  takeRecords(): MutationRecord[] { return []; }
}

global.MutationObserver = MockMutationObserver;
