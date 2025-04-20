export interface PrimerGuardConfig {
    blocklist?: string[];
}

export interface ImmunityEvent {
    type: 'patch_applied' | 'script_block' | 'blocked_script' | 'blocked_fetch' | 'js_error' | 'error' | 'unhandled_rejection';
    node?: Node;
    url?: string;
    message?: string;
    source?: string;
    line?: number;
    column?: number;
    error?: string;
    label?: string;
}

export interface PrimerGuardInterface {
    initialize(): void;
    immuneLog: ImmunityEvent[];
    blocklist: string[];
    getImmuneLog(): ImmunityEvent[];
    quarantineNode(node: Node): void;
    patch(label: string, fn: () => void): void;
}
