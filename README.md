# PrimerGuard

[![CI/CD](https://github.com/primers-ai/primerguard/actions/workflows/ci.yml/badge.svg)](https://github.com/primers-ai/primerguard/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/primerguard.svg)](https://badge.fury.io/js/primerguard)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🧬 **Autonomous Web Immunity Agent**  
A client-side TypeScript security agent that protects web applications in real-time against script injections, malicious network calls, and runtime errors. Inspired by biological immune systems.

## Features

### 🛡️ Real-time Protection
- Monitors DOM for suspicious script injections
- Blocks malicious fetch calls using configurable blocklist
- Captures and logs JavaScript runtime errors
- Provides quarantine and patching capabilities

### 🔧 Developer-Friendly
- Written in TypeScript with full type definitions
- Zero dependencies
- Modern ES modules support
- Comprehensive error logging

## Installation

```bash
npm install primerguard
# or
yarn add primerguard
```

## Quick Start

```typescript
import PrimerGuard from 'primerguard';

// Initialize with custom blocklist
const guard = new PrimerGuard({
  blocklist: ['malicious-site.com', 'evil-api.com']
});

// Check security logs
setInterval(() => {
  const logs = guard.getImmuneLog();
  console.log('Security Events:', logs);
}, 60000);
```

## API Documentation

### PrimerGuard Class

#### Constructor
```typescript
new PrimerGuard(config?: PrimerGuardConfig)

interface PrimerGuardConfig {
  blocklist?: string[];  // List of domains to block
}
```

#### Methods

##### `getImmuneLog(): ImmunityEvent[]`
Returns an array of security events that have been detected and handled.

```typescript
interface ImmunityEvent {
  type: 'script_block' | 'blocked_fetch' | 'js_error' | 'patch_applied';
  node?: Node;          // For script_block events
  url?: string;         // For blocked_fetch events
  message?: string;     // For js_error events
  source?: string;      // For js_error events
  line?: number;        // For js_error events
  column?: number;      // For js_error events
  error?: string;       // For js_error events
  label?: string;       // For patch_applied events
}
```

##### `quarantineNode(node: Node): void`
Safely removes a potentially malicious DOM node from the document.

##### `patch(label: string, fn: () => void): void`
Applies a security patch with logging.

## Examples

### Blocking Malicious Scripts
```typescript
// PrimerGuard automatically blocks injected scripts
// from unknown domains
const guard = new PrimerGuard();

// Check what was blocked
setTimeout(() => {
  const logs = guard.getImmuneLog();
  const blockedScripts = logs.filter(log => log.type === 'script_block');
  console.log('Blocked Scripts:', blockedScripts);
}, 5000);
```

### Custom Security Patches
```typescript
const guard = new PrimerGuard();

// Apply a custom security patch
guard.patch('XSS-vuln-fix', () => {
  // Your patch implementation
  document.querySelectorAll('input[type="text"]').forEach(input => {
    input.setAttribute('data-xss-protected', 'true');
  });
});
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

For security issues, please email security@primers.ai instead of using the issue tracker.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 [Documentation](https://docs.primers.ai/primerguard)
- 🐛 [Issue Tracker](https://github.com/primers-ai/primerguard/issues)
- 💬 [Community Discord](https://discord.gg/primers-ai)

---

Made with 🧬 by [Primers AI](https://primers.ai)
