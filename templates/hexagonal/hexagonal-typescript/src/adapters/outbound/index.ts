/**
 * Outbound Adapters - Implementations of outbound ports.
 */

import { Order, OrderProps } from '../../domain/entities';
import { OrderRepositoryPort, EventBusPort, CachePort, DomainEvent } from '../../domain/ports/outbound';

/**
 * In-Memory Order Repository - Simple in-memory implementation.
 *
 * This is a development/fallback implementation.
 * For production, use a database adapter.
 */
export class InMemoryOrderRepository implements OrderRepositoryPort {
  private orders: Map<string, OrderProps> = new Map();

  async save(order: OrderProps): Promise<void> {
    this.orders.set(order.id, { ...order, items: [...order.items] });
  }

  async findById(orderId: string): Promise<OrderProps | null> {
    const order = this.orders.get(orderId);
    if (!order) return null;
    return { ...order, items: [...order.items] };
  }

  async findByCustomer(customerId: string, limit = 100, offset = 0): Promise<OrderProps[]> {
    const orders = Array.from(this.orders.values())
      .filter((o) => o.customerId === customerId)
      .slice(offset, offset + limit)
      .map((o) => ({ ...o, items: [...o.items] }));
    return orders;
  }

  async delete(orderId: string): Promise<void> {
    this.orders.delete(orderId);
  }

  clear(): void {
    this.orders.clear();
  }
}

/**
 * In-Memory Event Bus - Simple in-memory implementation.
 *
 * This is a development/fallback implementation.
 * For production, use Kafka, RabbitMQ, or similar.
 */
export class InMemoryEventBus implements EventBusPort {
  private _handlers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map();

  async publish(event: DomainEvent): Promise<void> {
    // Snapshot handlers to avoid race between publish and concurrent subscribe
    const handlers = this._handlers.get(event.eventType);
    if (!handlers) return;
    // Iterate over a snapshot copy for safe concurrent access
    const snapshot = [...handlers];
    for (const handler of snapshot) {
      await handler(event);
    }
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    await Promise.all(events.map((e) => this.publish(e)));
  }

  async subscribe<T extends DomainEvent>(
    eventType: string,
    handler: (event: T) => Promise<void>
  ): Promise<void> {
    // Copy-on-write: create a new array to avoid race with concurrent publish iteration
    const existing = this._handlers.get(eventType) || [];
    this._handlers.set(eventType, [...existing, handler as (event: DomainEvent) => Promise<void>]);
  }

  clear(): void {
    this._handlers.clear();
  }
}

/**
 * In-Memory Cache - Simple in-memory implementation.
 *
 * This is a development/fallback implementation.
 * For production, use Redis or Memcached.
 */
export class InMemoryCache implements CachePort {
  private cache: Map<string, { value: unknown; expiresAt?: number }> = new Map();
  private readonly maxEntries: number;

  constructor(maxEntries = 1000) {
    this.maxEntries = maxEntries;
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.cache.has(key) && this.cache.size >= this.maxEntries) {
      // Evict expired entries first, then oldest non-expired entry
      const now = Date.now();
      let oldestKey: string | null = null;
      let oldestTime = Infinity;
      for (const [k, v] of this.cache) {
        if (v.expiresAt && v.expiresAt < now) {
          this.cache.delete(k);
          if (this.cache.size < this.maxEntries) break;
        } else if (v.expiresAt && v.expiresAt < oldestTime) {
          oldestKey = k;
          oldestTime = v.expiresAt;
        }
      }
      // If still over limit after expired eviction, evict the entry closest to expiry
      if (this.cache.size >= this.maxEntries && oldestKey !== null) {
        this.cache.delete(oldestKey);
      }
    }
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.cache.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}
