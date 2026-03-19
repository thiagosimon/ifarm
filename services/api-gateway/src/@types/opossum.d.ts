declare module 'opossum' {
  interface CircuitBreakerOptions {
    timeout?: number;
    errorThresholdPercentage?: number;
    resetTimeout?: number;
    rollingCountTimeout?: number;
    rollingCountBuckets?: number;
    name?: string;
    volumeThreshold?: number;
  }

  interface CircuitBreakerStats {
    snapshot: Record<string, unknown>;
  }

  class CircuitBreaker<TI extends unknown[] = unknown[], TR = unknown> {
    constructor(
      action: (...args: TI) => Promise<TR>,
      options?: CircuitBreakerOptions,
    );
    fire(...args: TI): Promise<TR>;
    on(event: string, callback: () => void): this;
    opened: boolean;
    halfOpen: boolean;
    closed: boolean;
    stats?: CircuitBreakerStats;
    fallback(fn: (...args: TI) => unknown): this;
  }

  export = CircuitBreaker;
}
