declare var console: {error(...args: unknown[]): void; trace(...args: unknown[]): void; warn(...args: unknown[]): void; info(...args: unknown[]): void; log(...args: unknown[]): void};
declare function fetch(input: string, init?: {method?: string; headers?: Record<string, string>; body?: string}): Promise<{status: number; json(): Promise<unknown>}>;
declare module "string-format" {
  export default function(format: string, ...args: unknown[]): string;
}
