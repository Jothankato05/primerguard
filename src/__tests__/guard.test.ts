import { PrimerGuard } from '../lib/guard';

describe('PrimerGuard', () => {
  let guard: PrimerGuard;

  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = '';
    guard = new PrimerGuard();
  });

  test('should initialize with default config', () => {
    expect(guard).toBeInstanceOf(PrimerGuard);
  });

  test('should block malicious fetch calls', async () => {
    const maliciousUrl = 'https://malware.com/api';
    const response = await fetch(maliciousUrl).catch(e => e);
    expect(response).toBeDefined();
    expect(response.status).toBe(403);
  });

  test('should prevent script injection', () => {
    const script = document.createElement('script');
    script.src = 'https://malicious-cdn.com/hack.js';
    document.body.appendChild(script);
    
    // Script should be removed
    expect(document.querySelector('script[src*="malicious-cdn.com"]')).toBeNull();
  });
});
