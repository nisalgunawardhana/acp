# Agent Communication Protocol SDK for JavaScript

A pure JavaScript SDK for communicating with Agent Communication Protocol (ACP) servers.

## Features

- 🚀 **Pure JavaScript** - No TypeScript dependencies, works in any JavaScript environment
- 🌐 **Universal** - Works in Node.js, browsers, and edge runtimes
- 📡 **Streaming Support** - Full support for Server-Sent Events streaming
- 🔄 **Session Management** - Built-in session handling
- ⚡ **Lightweight** - Minimal dependencies, maximum performance
- 📝 **Well Documented** - Complete JSDoc documentation for IDE support

## Installation

```bash
npm install acp-js-sdk
```

Or with other package managers:

```bash
yarn add acp-sdk-js
pnpm install acp-sdk-js
```

## Quick Start

```javascript
import { Client } from 'acp-sdk-js';

// Create a client
const client = new Client({ 
  baseUrl: 'http://localhost:8000' 
});

// Run an agent synchronously
const run = await client.runSync('echo', 'Hello, World!');
console.log(run.output);

// Run an agent with streaming
for await (const event of client.runStream('echo', 'Hello, World!')) {
  console.log('Event:', event);
}
```

## API Reference

### Client

#### Constructor

```javascript
const client = new Client({
  baseUrl: 'http://localhost:8000',  // ACP server URL
  fetch: customFetch,                // Optional custom fetch implementation
  sessionId: 'my-session'            // Optional session ID
});
```

#### Methods

##### Basic Operations

- `ping()` - Check server connectivity
- `agents()` - Get list of available agents
- `agent(name)` - Get specific agent manifest

##### Agent Execution

- `runSync(agentName, input)` - Run agent synchronously
- `runAsync(agentName, input)` - Run agent asynchronously  
- `runStream(agentName, input, signal?)` - Run agent with streaming

##### Run Management

- `runStatus(runId)` - Get run status
- `runEvents(runId)` - Get run events
- `runCancel(runId)` - Cancel a run

##### Run Resumption

- `runResumeSync(runId, awaitResume)` - Resume run synchronously
- `runResumeAsync(runId, awaitResume)` - Resume run asynchronously
- `runResumeStream(runId, awaitResume, signal?)` - Resume run with streaming

##### Session Management

- `withSession(callback, sessionId?)` - Execute callback with specific session
- `getSessionId()` - Get current session ID

## Examples

### Basic Agent Execution

```javascript
import { Client } from 'acp-sdk-js';

const client = new Client({ baseUrl: 'http://localhost:8000' });

// Simple text input
const result = await client.runSync('echo', 'Hello!');
console.log(result.output);

// Complex input with multiple messages
const complexResult = await client.runSync('analyzer', [
  { type: 'text', content: 'Analyze this data:' },
  { type: 'text', content: 'Data: [1, 2, 3, 4, 5]' }
]);
```

### Streaming Events

```javascript
// Stream events from agent execution
for await (const event of client.runStream('long-running-agent', 'input')) {
  switch (event.type) {
    case 'start':
      console.log('Agent started');
      break;
    case 'message':
      console.log('Message:', event.data);
      break;
    case 'end':
      console.log('Agent completed');
      break;
    case 'error':
      console.error('Error:', event.error);
      break;
  }
}
```

### Session Management

```javascript
// Execute multiple operations within the same session
await client.withSession(async (sessionClient) => {
  const run1 = await sessionClient.runSync('agent1', 'input1');
  const run2 = await sessionClient.runSync('agent2', 'input2');
  
  // Both runs share the same session context
  console.log('Session ID:', sessionClient.getSessionId());
});
```

### Error Handling

```javascript
import { Client, ACPError, HTTPError, FetchError } from 'acp-sdk-js';

try {
  const result = await client.runSync('nonexistent-agent', 'input');
} catch (error) {
  if (error instanceof ACPError) {
    console.error('ACP Error:', error.code, error.message);
  } else if (error instanceof HTTPError) {
    console.error('HTTP Error:', error.status, error.statusText);
  } else if (error instanceof FetchError) {
    console.error('Network Error:', error.message);
  } else {
    console.error('Unknown Error:', error);
  }
}
```

### Custom Fetch Implementation

```javascript
// Use custom fetch for special requirements
const client = new Client({
  baseUrl: 'http://localhost:8000',
  fetch: async (url, options) => {
    // Add custom headers, authentication, etc.
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': 'Bearer ' + token,
        'X-Custom-Header': 'value'
      }
    });
  }
});
```

### Cancellation

```javascript
// Cancel streaming operations
const controller = new AbortController();

// Start streaming
const streamPromise = (async () => {
  for await (const event of client.runStream('agent', 'input', controller.signal)) {
    console.log(event);
  }
})();

// Cancel after 5 seconds
setTimeout(() => {
  controller.abort();
}, 5000);

try {
  await streamPromise;
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Stream was cancelled');
  }
}
```

## Constants

The SDK exports useful constants:

```javascript
import {
  RunModes,
  EventTypes,
  RunStatuses,
  MessageTypes,
  ErrorCodes
} from 'acp-sdk-js';

console.log(RunModes.SYNC);      // 'sync'
console.log(EventTypes.START);   // 'start'
console.log(RunStatuses.RUNNING); // 'running'
```

## Requirements

- Node.js 16+ (for Node.js environments)
- Modern browser with fetch and AsyncIterator support
- ACP server running on accessible endpoint


