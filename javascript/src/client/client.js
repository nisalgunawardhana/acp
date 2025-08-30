/**


 */

import { v4 as uuid } from 'uuid';
import { ACPError, BaseError, FetchError, HTTPError } from './errors.js';
import { createEventSource } from './sse.js';
import { inputToMessages, normalizeBaseUrl, createJsonPost } from '../utils/helpers.js';
import {
  validatePingResponse,
  validateAgentsListResponse,
  validateRunCreateResponse,
  validateRunReadResponse,
  validateRunEventsListResponse,
  validateEvent,
  validateErrorModel,
} from '../utils/validation.js';

/**
 * ACP Client for communicating with Agent Communication Protocol servers
 */
export class Client {
  /**
   * Create a new ACP Client
   * @param {Object} options - Client configuration options
   * @param {string} [options.baseUrl=''] - Base URL for the ACP server
   * @param {Function} [options.fetch] - Custom fetch implementation
   * @param {string} [options.sessionId] - Session ID for requests
   */
  constructor(options = {}) {
    this.fetch = options.fetch || globalThis.fetch.bind(globalThis);
    this.baseUrl = normalizeBaseUrl(options.baseUrl || '');
    this.sessionId = options.sessionId;
  }

  /**
   * Get the current session ID
   * @returns {string|undefined} Current session ID
   */
  getSessionId() {
    return this.sessionId;
  }

  /**
   * Execute a callback with a specific session
   * @param {Function} callback - Callback function to execute
   * @param {string} [sessionId] - Session ID to use (generates new one if not provided)
   * @returns {Promise} Result of the callback
   */
  async withSession(callback, sessionId = uuid()) {
    const client = new Client({
      fetch: this.fetch,
      baseUrl: this.baseUrl,
      sessionId,
    });
    return await callback(client);
  }

  /**
   * Internal method to make HTTP requests
   * @private
   */
  async _fetcher(url, options = {}) {
    let response;
    try {
      response = await this.fetch(this.baseUrl + url, options);
      await this._handleErrorResponse(response);
      return await response.json();
    } catch (err) {
      if (err instanceof BaseError || (err instanceof Error && err.name === 'AbortError')) {
        throw err;
      }
      throw new FetchError(err.message || 'fetch failed', response, { cause: err });
    }
  }

  /**
   * Internal method to create event source for streaming
   * @private
   */
  async _fetchEventSource(url, options = {}) {
    let eventSource;
    try {
      eventSource = await createEventSource({
        url: this.baseUrl + url,
        fetch: this.fetch,
        options,
      });
    } catch (err) {
      throw new FetchError(err.message || 'fetch failed', undefined, { cause: err });
    }
    await this._handleErrorResponse(eventSource.response);
    return eventSource;
  }

  /**
   * Internal method to handle error responses
   * @private
   */
  async _handleErrorResponse(response) {
    if (response.ok) return;

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new HTTPError(response, text);
    }

    try {
      const errorData = validateErrorModel(data);
      throw new ACPError(errorData);
    } catch (validationError) {
      throw new HTTPError(response, data);
    }
  }

  /**
   * Internal method to process event source streams
   * @private
   */
  async *_processEventSource(eventSource) {
    for await (const message of eventSource.consume()) {
      const event = validateEvent(JSON.parse(message.data));
      if (event.type === 'error') {
        throw new ACPError(event.error);
      }
      yield event;
    }
  }

  /**
   * Ping the ACP server to check connectivity
   * @returns {Promise<Object>} Ping response
   */
  async ping() {
    const data = await this._fetcher('/ping', { method: 'GET' });
    return validatePingResponse(data);
  }

  /**
   * Get list of available agents
   * @returns {Promise<Array>} Array of agent manifests
   */
  async agents() {
    const data = await this._fetcher('/agents', { method: 'GET' });
    const response = validateAgentsListResponse(data);
    return response.agents;
  }

  /**
   * Get specific agent manifest
   * @param {string} name - Agent name
   * @returns {Promise<Object>} Agent manifest
   */
  async agent(name) {
    const data = await this._fetcher(`/agents/${name}`, { method: 'GET' });
    return data; // Agent manifest response validation can be added here
  }

  /**
   * Run an agent synchronously
   * @param {string} agentName - Name of the agent to run
   * @param {string|Array} input - Input for the agent
   * @returns {Promise<Object>} Run result
   */
  async runSync(agentName, input) {
    const data = await this._fetcher(
      '/runs',
      createJsonPost({
        agent_name: agentName,
        input: inputToMessages(input),
        mode: 'sync',
        session_id: this.sessionId,
      })
    );
    return validateRunCreateResponse(data);
  }

  /**
   * Run an agent asynchronously
   * @param {string} agentName - Name of the agent to run
   * @param {string|Array} input - Input for the agent
   * @returns {Promise<Object>} Run result
   */
  async runAsync(agentName, input) {
    const data = await this._fetcher(
      '/runs',
      createJsonPost({
        agent_name: agentName,
        input: inputToMessages(input),
        mode: 'async',
        session_id: this.sessionId,
      })
    );
    return validateRunCreateResponse(data);
  }

  /**
   * Run an agent with streaming response
   * @param {string} agentName - Name of the agent to run
   * @param {string|Array} input - Input for the agent
   * @param {AbortSignal} [signal] - Abort signal for cancellation
   * @returns {AsyncGenerator<Object>} Stream of events
   */
  async *runStream(agentName, input, signal) {
    const eventSource = await this._fetchEventSource(
      '/runs',
      createJsonPost(
        {
          agent_name: agentName,
          input: inputToMessages(input),
          mode: 'stream',
          session_id: this.sessionId,
        },
        { signal }
      )
    );
    for await (const event of this._processEventSource(eventSource)) {
      yield event;
    }
  }

  /**
   * Get status of a specific run
   * @param {string} runId - Run ID
   * @returns {Promise<Object>} Run status
   */
  async runStatus(runId) {
    const data = await this._fetcher(`/runs/${runId}`, { method: 'GET' });
    return validateRunReadResponse(data);
  }

  /**
   * Get events for a specific run
   * @param {string} runId - Run ID
   * @returns {Promise<Array>} Array of events
   */
  async runEvents(runId) {
    const data = await this._fetcher(`/runs/${runId}/events`, { method: 'GET' });
    const response = validateRunEventsListResponse(data);
    return response.events;
  }

  /**
   * Cancel a specific run
   * @param {string} runId - Run ID
   * @returns {Promise<Object>} Updated run status
   */
  async runCancel(runId) {
    const data = await this._fetcher(`/runs/${runId}/cancel`, { method: 'POST' });
    return validateRunReadResponse(data);
  }

  /**
   * Resume a run synchronously
   * @param {string} runId - Run ID
   * @param {Object} awaitResume - Resume data
   * @returns {Promise<Object>} Run result
   */
  async runResumeSync(runId, awaitResume) {
    const data = await this._fetcher(
      `/runs/${runId}`,
      createJsonPost({
        await_resume: awaitResume,
        mode: 'sync',
      })
    );
    return validateRunReadResponse(data);
  }

  /**
   * Resume a run asynchronously
   * @param {string} runId - Run ID
   * @param {Object} awaitResume - Resume data
   * @returns {Promise<Object>} Run result
   */
  async runResumeAsync(runId, awaitResume) {
    const data = await this._fetcher(
      `/runs/${runId}`,
      createJsonPost({
        await_resume: awaitResume,
        mode: 'async',
      })
    );
    return validateRunReadResponse(data);
  }

  /**
   * Resume a run with streaming response
   * @param {string} runId - Run ID
   * @param {Object} awaitResume - Resume data
   * @param {AbortSignal} [signal] - Abort signal for cancellation
   * @returns {AsyncGenerator<Object>} Stream of events
   */
  async *runResumeStream(runId, awaitResume, signal) {
    const eventSource = await this._fetchEventSource(
      `/runs/${runId}`,
      createJsonPost(
        {
          await_resume: awaitResume,
          mode: 'stream',
        },
        { signal }
      )
    );
    for await (const event of this._processEventSource(eventSource)) {
      yield event;
    }
  }
}
