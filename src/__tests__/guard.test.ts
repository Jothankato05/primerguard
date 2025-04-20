import { PrimerGuard } from '../lib/guard';

describe('PrimerGuard', () => {
  let guard: PrimerGuard;

  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = '';
    guard = new PrimerGuard({
      blocklist: ['malicious-cdn.com']
    });
    // Initialize protection
    guard.initialize();
  });

  test('should initialize with default config', () => {
    expect(guard).toBeInstanceOf(PrimerGuard);
    expect(guard.immuneLog).toEqual([]);
    expect(guard.blocklist).toContain('malicious-cdn.com');
  });

  test('should initialize with empty blocklist if not provided', () => {
    const defaultGuard = new PrimerGuard({});
    expect(defaultGuard.blocklist).toEqual([]);
  });

  test('should block malicious fetch calls', async () => {
    const originalFetch = window.fetch;
    const fetchSpy = jest.fn().mockResolvedValue(new Response());
    window.fetch = fetchSpy;
    
    // Attempt to fetch from malicious domain
    await guard.fetch('https://malicious-cdn.com/hack.js');
    
    expect(guard.immuneLog).toContainEqual({
      type: 'blocked_fetch',
      url: 'https://malicious-cdn.com/hack.js'
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    
    // Restore original fetch
    window.fetch = originalFetch;
  });

  test('should allow safe fetch calls', async () => {
    const originalFetch = window.fetch;
    const fetchSpy = jest.fn().mockResolvedValue(new Response());
    window.fetch = fetchSpy;
    
    // Attempt to fetch from safe domain
    await guard.fetch('https://safe-cdn.com/script.js');
    
    expect(guard.immuneLog).toEqual([]);
    expect(fetchSpy).toHaveBeenCalledWith('https://safe-cdn.com/script.js', undefined);
    
    // Restore original fetch
    window.fetch = originalFetch;
  });

  test('should prevent script injection', async () => {
    // Create and inject a malicious script
    const script = document.createElement('script');
    script.src = 'https://malicious-cdn.com/hack.js';
    document.documentElement.appendChild(script);
    
    // Wait for MutationObserver to fire
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(document.querySelector('script[src*="malicious-cdn.com"]')).toBeNull();
    expect(guard.immuneLog).toContainEqual({
      type: 'blocked_script',
      url: 'https://malicious-cdn.com/hack.js'
    });
  });

  test('should allow safe script injection', async () => {
    // Create and inject a safe script
    const script = document.createElement('script');
    script.src = 'https://safe-cdn.com/script.js';
    document.documentElement.appendChild(script);
    
    // Wait for MutationObserver to fire
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(document.querySelector('script[src="https://safe-cdn.com/script.js"]')).not.toBeNull();
    expect(guard.immuneLog).toEqual([]);
  });

  test('should handle non-script node mutations', async () => {
    // Create and inject a div
    const div = document.createElement('div');
    document.documentElement.appendChild(div);
    
    // Wait for MutationObserver to fire
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(document.querySelector('div')).not.toBeNull();
    expect(guard.immuneLog).toEqual([]);
  });

  test('should handle and log runtime errors', () => {
    const error = new Error('Test error');
    const errorEvent = new Event('error');
    Object.defineProperty(errorEvent, 'error', { value: error });

    window.dispatchEvent(errorEvent);

    expect(guard.immuneLog).toContainEqual({
      type: 'error',
      message: error.message
    });
  });

  test('should handle and log unhandled promise rejections', () => {
    const rejection = new Error('Test rejection');
    const event = new Event('unhandledrejection');
    Object.defineProperty(event, 'reason', { value: rejection });

    window.dispatchEvent(event);

    expect(guard.immuneLog).toContainEqual({
      type: 'unhandled_rejection',
      message: rejection.message
    });
  });

  test('should apply and log patches', () => {
    let patchApplied = false;
    guard.patch('test-patch', () => {
      patchApplied = true;
    });

    expect(patchApplied).toBe(true);
    expect(guard.immuneLog).toContainEqual({
      type: 'patch_applied',
      label: 'test-patch'
    });
  });

  test('should handle quarantining nodes', () => {
    const node = document.createElement('div');
    document.body.appendChild(node);
    expect(document.body.contains(node)).toBe(true);

    guard.quarantineNode(node);
    expect(document.body.contains(node)).toBe(false);
  });
});
