import { PrimerGuard } from '../lib/guard';

describe('PrimerGuard', () => {
  let guard: PrimerGuard;

  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = '';
    guard = new PrimerGuard();
    // Initialize protection
    guard.initialize();
  });

  test('should initialize with default config', () => {
    expect(guard).toBeInstanceOf(PrimerGuard);
  });

  test('should block malicious fetch calls', async () => {
    const maliciousUrl = 'https://malware.com/hack.js';
    const response = await window.fetch(maliciousUrl);
    expect(response.status).toBe(403);
    expect(guard.immuneLog).toContainEqual({
      type: 'blocked_fetch',
      url: maliciousUrl
    });
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
});
