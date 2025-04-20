export interface PrimerGuardConfig {
    blocklist?: string[];
}

export interface ImmunityEvent {
    type: 'script_block' | 'blocked_fetch' | 'js_error' | 'patch_applied';
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
    immuneLog: ImmunityEvent[];
    blocklist: string[];
    getImmuneLog(): ImmunityEvent[];
    quarantineNode(node: Node): void;
    patch(label: string, fn: () => void): void;
}
