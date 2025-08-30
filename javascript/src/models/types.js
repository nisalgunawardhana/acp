/**


 */

/**
 * @typedef {Object} Author
 * @property {string} name - Author name
 * @property {string} [email] - Author email
 * @property {string} [url] - Author URL
 */

/**
 * @typedef {Object} Contributor
 * @property {string} name - Contributor name
 * @property {string} [email] - Contributor email
 * @property {string} [url] - Contributor URL
 */

/**
 * @typedef {Object} Link
 * @property {string} type - Link type (source-code, container-image, homepage, documentation)
 * @property {string} url - Link URL
 */

/**
 * @typedef {Object} Dependency
 * @property {string} type - Dependency type (agent, tool, model)
 * @property {string} name - Dependency name
 * @property {string} [version] - Dependency version
 */

/**
 * @typedef {Object} AgentManifest
 * @property {string} name - Agent name
 * @property {string} version - Agent version
 * @property {string} description - Agent description
 * @property {Author} [author] - Agent author
 * @property {Contributor[]} [contributors] - Agent contributors
 * @property {string} [homepage] - Agent homepage
 * @property {string} [repository] - Agent repository
 * @property {string[]} [keywords] - Agent keywords
 * @property {string} [license] - Agent license
 * @property {Link[]} [links] - Agent links
 * @property {Dependency[]} [dependencies] - Agent dependencies
 * @property {Object} [config] - Agent configuration
 */

/**
 * @typedef {Object} Message
 * @property {string} type - Message type (text, image, tool_use, tool_result)
 * @property {string} [content] - Message content
 * @property {Object} [data] - Additional message data
 */

/**
 * @typedef {Object} Run
 * @property {string} id - Run ID
 * @property {string} agent_name - Agent name
 * @property {string} status - Run status
 * @property {Message[]} input - Run input messages
 * @property {Message[]} [output] - Run output messages
 * @property {string} [session_id] - Session ID
 * @property {string} created_at - Creation timestamp
 * @property {string} [updated_at] - Update timestamp
 * @property {string} [completed_at] - Completion timestamp
 * @property {Object} [error] - Error information if failed
 * @property {Object} [metadata] - Additional metadata
 */

/**
 * @typedef {Object} Event
 * @property {string} type - Event type
 * @property {string} run_id - Run ID
 * @property {string} timestamp - Event timestamp
 * @property {Object} [data] - Event data
 * @property {Object} [error] - Error information for error events
 */

/**
 * @typedef {Object} ErrorModel
 * @property {string} type - Error type
 * @property {string} code - Error code
 * @property {string} message - Error message
 * @property {Object} [details] - Additional error details
 */

/**
 * @typedef {Object} PingResponse
 * @property {string} status - Status message
 * @property {string} [version] - Server version
 * @property {number} [timestamp] - Response timestamp
 */

/**
 * @typedef {Object} AgentsListResponse
 * @property {AgentManifest[]} agents - List of available agents
 */

/**
 * @typedef {Object} RunCreateRequest
 * @property {string} agent_name - Agent name to run
 * @property {Message[]} input - Input messages
 * @property {string} mode - Run mode (sync, async, stream)
 * @property {string} [session_id] - Session ID
 * @property {Object} [config] - Run configuration
 */

/**
 * @typedef {Object} RunResumeRequest
 * @property {Object} await_resume - Resume data
 * @property {string} mode - Run mode (sync, async, stream)
 */

/**
 * @typedef {Object} RunEventsListResponse
 * @property {Event[]} events - List of run events
 */

// JSDoc type definitions for better IDE support
// These don't export anything but provide type information
export {};
