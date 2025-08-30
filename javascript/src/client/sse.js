/**


 */

import { createParser } from 'eventsource-parser';

export class EventSource {
  constructor(response) {
    this.response = response;
    this.parser = createParser((event) => {
      if (event.type === 'event') {
        this.eventQueue.push(event);
      }
    });
    this.eventQueue = [];
    this.reader = null;
  }

  async *consume() {
    if (!this.response.body) {
      throw new Error('Response body is null');
    }

    this.reader = this.response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await this.reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        this.parser.feed(chunk);

        // Yield all queued events
        while (this.eventQueue.length > 0) {
          yield this.eventQueue.shift();
        }
      }
    } finally {
      if (this.reader) {
        this.reader.releaseLock();
      }
    }
  }

  close() {
    if (this.reader) {
      this.reader.cancel();
      this.reader.releaseLock();
    }
  }
}

export async function createEventSource({ url, fetch, options = {} }) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
      ...options.headers,
    },
  });

  return new EventSource(response);
}
