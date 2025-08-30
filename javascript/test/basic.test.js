/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client, RunModes, EventTypes } from '../src/index.js';

// Basic test to verify the SDK works
describe('ACP SDK Basic Tests', () => {
  test('Client can be instantiated', () => {
    const client = new Client({ baseUrl: 'http://localhost:8000' });
    expect(client).toBeDefined();
    expect(client.baseUrl).toBe('http://localhost:8000');
  });

  test('Constants are exported correctly', () => {
    expect(RunModes.SYNC).toBe('sync');
    expect(RunModes.ASYNC).toBe('async');
    expect(RunModes.STREAM).toBe('stream');
    
    expect(EventTypes.START).toBe('start');
    expect(EventTypes.END).toBe('end');
    expect(EventTypes.ERROR).toBe('error');
  });

  test('Client methods exist', () => {
    const client = new Client();
    
    expect(typeof client.ping).toBe('function');
    expect(typeof client.agents).toBe('function');
    expect(typeof client.agent).toBe('function');
    expect(typeof client.runSync).toBe('function');
    expect(typeof client.runAsync).toBe('function');
    expect(typeof client.runStream).toBe('function');
    expect(typeof client.runStatus).toBe('function');
    expect(typeof client.runEvents).toBe('function');
    expect(typeof client.runCancel).toBe('function');
    expect(typeof client.withSession).toBe('function');
    expect(typeof client.getSessionId).toBe('function');
  });
});
