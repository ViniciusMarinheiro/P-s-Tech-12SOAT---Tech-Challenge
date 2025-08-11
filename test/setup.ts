import { webcrypto } from 'crypto';
(global as any).crypto = webcrypto;

process.env.NODE_ENV = 'test';

jest.mock('ioredis', () => require('ioredis-mock'));

jest.mock('bullmq', () => {
  class FakeQueue {
    constructor(..._args: any[]) {}
    add(..._args: any[]) { return Promise.resolve(); }
    addBulk(..._args: any[]) { return Promise.resolve([]); }
    pause() { return Promise.resolve(); }
    close() { return Promise.resolve(); }
    on() {}
    waitUntilReady() { return Promise.resolve(); }
  }
  class FakeWorker {
    constructor(..._args: any[]) {}
    on() {}
    close() { return Promise.resolve(); }
    waitUntilReady() { return Promise.resolve(); }
  }
  class FakeQueueEvents {
    constructor(..._args: any[]) {}
    on() {}
    close() { return Promise.resolve(); }
  }
  return { Queue: FakeQueue, Worker: FakeWorker, QueueEvents: FakeQueueEvents };
});
