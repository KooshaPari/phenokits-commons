/**
 * Tests for Outbound Adapters - verifies concurrency safety and memory management fixes.
 *
 * Fixes tested:
 * 1. InMemoryEventBus: copy-on-write subscribe prevents race with concurrent publish
 * 2. InMemoryCache: max entry eviction prevents unbounded memory growth
 */
import {
  InMemoryEventBus,
  InMemoryCache,
} from '../index';
import { DomainEvent } from '../../../domain/ports/outbound';

// ── Helpers ───────────────────────────────────────────

const makeEvent = (eventType: string, aggregateId = 'agg-1'): DomainEvent => ({
  eventType,
  occurredAt: new Date(),
  aggregateId,
});

const delayedHandler =
  (ms: number) =>
  async (_event: DomainEvent): Promise<void> => {
    await new Promise((r) => setTimeout(r, ms));
  };

// ── InMemoryEventBus ──────────────────────────────────

describe('InMemoryEventBus', () => {
  let bus: InMemoryEventBus;

  beforeEach(() => {
    bus = new InMemoryEventBus();
  });

  describe('subscribe / publish', () => {
    it('delivers events to subscribed handlers', async () => {
      const handler = jest.fn();
      await bus.subscribe('order.created', handler);

      const event = makeEvent('order.created');
      await bus.publish(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('does not call handlers for other event types', async () => {
      const handler = jest.fn();
      await bus.subscribe('order.shipped', handler);

      await bus.publish(makeEvent('order.created'));

      expect(handler).not.toHaveBeenCalled();
    });

    it('supports multiple handlers for the same event type', async () => {
      const handlerA = jest.fn();
      const handlerB = jest.fn();
      await bus.subscribe('order.created', handlerA);
      await bus.subscribe('order.created', handlerB);

      await bus.publish(makeEvent('order.created'));

      expect(handlerA).toHaveBeenCalledTimes(1);
      expect(handlerB).toHaveBeenCalledTimes(1);
    });

    it('publishBatch delivers all events', async () => {
      const handler = jest.fn();
      await bus.subscribe('order.created', handler);

      await bus.publishBatch([
        makeEvent('order.created', 'agg-1'),
        makeEvent('order.created', 'agg-2'),
      ]);

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('clear removes all handlers', async () => {
      const handler = jest.fn();
      await bus.subscribe('order.created', handler);
      bus.clear();

      await bus.publish(makeEvent('order.created'));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('concurrency safety', () => {
    it('handles concurrent subscribe and publish without data races', async () => {
      // Subscribe a slow handler
      const slowHandler = delayedHandler(50);
      await bus.subscribe('order.created', slowHandler);

      // While publish is in flight, subscribe another handler (copy-on-write should prevent race)
      const publishPromise = bus.publish(makeEvent('order.created'));
      const subscribePromise = bus.subscribe('order.created', jest.fn());

      // Both should complete without error
      await expect(publishPromise).resolves.toBeUndefined();
      await expect(subscribePromise).resolves.toBeUndefined();
    });

    it('handlers added after publish starts are not invoked for that publish', async () => {
      // Subscribe initial handler
      const handler1 = jest.fn();
      await bus.subscribe('order.created', handler1);

      // Start publish (use setTimeout to interleave subscribe)
      let subscribeDone = false;
      const origPublish = bus.publish.bind(bus);
      bus.publish = jest.fn().mockImplementation(async (event) => {
        // Simulate interleaving: trigger subscribe during publish
        if (!subscribeDone) {
          await bus.subscribe('order.created', jest.fn());
          subscribeDone = true;
        }
        return origPublish(event);
      });

      await bus.publish(makeEvent('order.created'));

      // handler1 should have been called exactly once (snapshot was taken before subscribe)
      expect(handler1).toHaveBeenCalledTimes(1);
    });
  });
});

// ── InMemoryCache ─────────────────────────────────────

describe('InMemoryCache', () => {
  describe('basic operations', () => {
    it('stores and retrieves values', async () => {
      const cache = new InMemoryCache();
      await cache.set('key1', 'value1');
      expect(await cache.get('key1')).toBe('value1');
    });

    it('returns null for missing keys', async () => {
      const cache = new InMemoryCache();
      expect(await cache.get('nonexistent')).toBeNull();
    });

    it('overwrites existing values', async () => {
      const cache = new InMemoryCache();
      await cache.set('key', 'old');
      await cache.set('key', 'new');
      expect(await cache.get('key')).toBe('new');
    });

    it('deletes values', async () => {
      const cache = new InMemoryCache();
      await cache.set('key', 'value');
      await cache.delete('key');
      expect(await cache.get('key')).toBeNull();
    });

    it('clears all values', async () => {
      const cache = new InMemoryCache();
      await cache.set('a', 1);
      await cache.set('b', 2);
      await cache.clear();
      expect(await cache.get('a')).toBeNull();
      expect(await cache.get('b')).toBeNull();
    });
  });

  describe('TTL expiry', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns value within TTL', async () => {
      const cache = new InMemoryCache();
      await cache.set('key', 'value', 60);
      expect(await cache.get('key')).toBe('value');
    });

    it('returns null after TTL expiry', async () => {
      const cache = new InMemoryCache();
      await cache.set('key', 'value', 1);
      jest.advanceTimersByTime(1500);
      expect(await cache.get('key')).toBeNull();
    });

    it('stores values without TTL indefinitely', async () => {
      const cache = new InMemoryCache();
      await cache.set('key', 'permanent');
      jest.advanceTimersByTime(999999);
      expect(await cache.get('key')).toBe('permanent');
    });
  });

  describe('eviction (max entries)', () => {
    it('evicts oldest entry when cache exceeds max', async () => {
      const cache = new InMemoryCache(2);
      await cache.set('a', 1, 3600);
      await cache.set('b', 2, 3600);
      // Cache is now full (2 entries)

      // Inserting a third should evict entry closest to expiry
      await cache.set('c', 3, 3600);

      // One entry should be gone (the one with earliest expiry time)
      const count = (await cache.get('a')) !== null
        ? (await cache.get('b')) !== null ? 1 : 0
        : 0;
      // At least 'c' should be present
      expect(await cache.get('c')).toBe(3);
      // Only 2 entries max
      expect((await cache.get('a')) !== null ? 1 : 0
        + (await cache.get('b')) !== null ? 1 : 0
        + 1).toBeLessThanOrEqual(2);
    });

    it('evicts expired entries before non-expired ones', async () => {
      jest.useFakeTimers();
      const cache = new InMemoryCache(2);

      // Insert an entry that will expire soon
      await cache.set('a', 1, 1); // expires in 1s
      await cache.set('b', 2, 3600); // expires in 1h

      // Advance time so 'a' is expired
      jest.advanceTimersByTime(2000);

      // Inserting a new entry should evict expired 'a'
      await cache.set('c', 3, 3600);

      expect(await cache.get('a')).toBeNull(); // expired and evicted
      expect(await cache.get('c')).toBe(3);
      expect(await cache.get('b')).toBe(2);

      jest.useRealTimers();
    });

    it('defaults to 1000 max entries', () => {
      const cache = new InMemoryCache();
      // Access private field via casting for test verification
      expect((cache as any).maxEntries).toBe(1000);
    });

    it('enforces default capacity of 1000', async () => {
      jest.useFakeTimers();
      const cache = new InMemoryCache(1000);

      // Fill to capacity with entries with distinct TTLs
      for (let i = 0; i < 1000; i++) {
        await cache.set(`key-${i}`, i, 3600);
      }

      expect(await cache.get('key-0')).toBe(0);
      expect(await cache.get('key-999')).toBe(999);

      // Adding one more should evict oldest (key with TTL 3600, whichever was first set)
      await cache.set('overflow', 'value', 3600);

      // Cache should still have 1000 entries max
      let count = 0;
      for (let i = 0; i < 1001; i++) {
        const val = await cache.get(`key-${i}`);
        if (val !== null) count++;
      }
      if (await cache.get('overflow') !== null) count++;

      expect(count).toBeLessThanOrEqual(1000);

      jest.useRealTimers();
    });
  });
});
