import { Injectable, Logger } from '@nestjs/common';
import * as CircuitBreaker from 'opossum';

export interface CircuitBreakerOptions {
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
  rollingCountTimeout?: number;
  rollingCountBuckets?: number;
  name?: string;
}

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  timeout: 8000, // 8 seconds
  errorThresholdPercentage: 50, // 50% failure rate
  resetTimeout: 30000, // 30 seconds before half-open
  rollingCountTimeout: 10000, // 10 second rolling window
  rollingCountBuckets: 10,
};

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly breakers = new Map<string, CircuitBreaker>();

  /**
   * Creates or retrieves a circuit breaker for the given service name.
   */
  getBreaker<T>(
    serviceName: string,
    action: (...args: any[]) => Promise<T>,
    options?: CircuitBreakerOptions,
  ): CircuitBreaker {
    const existingBreaker = this.breakers.get(serviceName);
    if (existingBreaker) {
      return existingBreaker;
    }

    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      name: serviceName,
    };

    const breaker = new CircuitBreaker(action, mergedOptions);

    breaker.on('open', () => {
      this.logger.warn(
        `Circuit breaker OPENED for service: ${serviceName}. ` +
          `Requests will be short-circuited for ${mergedOptions.resetTimeout}ms.`,
      );
    });

    breaker.on('halfOpen', () => {
      this.logger.log(
        `Circuit breaker HALF-OPEN for service: ${serviceName}. ` +
          `Next request will be a test.`,
      );
    });

    breaker.on('close', () => {
      this.logger.log(
        `Circuit breaker CLOSED for service: ${serviceName}. ` +
          `Normal operation resumed.`,
      );
    });

    breaker.on('fallback', () => {
      this.logger.debug(
        `Circuit breaker fallback triggered for service: ${serviceName}.`,
      );
    });

    breaker.on('timeout', () => {
      this.logger.warn(
        `Circuit breaker TIMEOUT for service: ${serviceName} ` +
          `(>${mergedOptions.timeout}ms).`,
      );
    });

    this.breakers.set(serviceName, breaker);
    return breaker;
  }

  /**
   * Executes an action through the circuit breaker for the given service.
   */
  async fire<T>(
    serviceName: string,
    action: (...args: any[]) => Promise<T>,
    ...args: any[]
  ): Promise<T> {
    const breaker = this.getBreaker(serviceName, action);
    return breaker.fire(...args) as Promise<T>;
  }

  /**
   * Returns the current state of a circuit breaker for a given service.
   */
  getState(serviceName: string): string {
    const breaker = this.breakers.get(serviceName);
    if (!breaker) {
      return 'unknown';
    }

    if (breaker.opened) return 'open';
    if (breaker.halfOpen) return 'half-open';
    if (breaker.closed) return 'closed';
    return 'unknown';
  }

  /**
   * Returns stats for all circuit breakers.
   */
  getAllStats(): Record<string, { state: string; stats: any }> {
    const result: Record<string, { state: string; stats: any }> = {};

    for (const [name, breaker] of this.breakers.entries()) {
      result[name] = {
        state: this.getState(name),
        stats: breaker.stats ? breaker.stats.snapshot : {},
      };
    }

    return result;
  }
}
