/**


 */

// Agent run modes
export const RunModes = {
  SYNC: 'sync',
  ASYNC: 'async',
  STREAM: 'stream',
};

// Event types
export const EventTypes = {
  START: 'start',
  END: 'end',
  ERROR: 'error',
  MESSAGE: 'message',
  OUTPUT: 'output',
  LOG: 'log',
  AWAIT_INPUT: 'await_input',
  AWAIT_RESUME: 'await_resume',
};

// Run statuses
export const RunStatuses = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  AWAITING_INPUT: 'awaiting_input',
};

// Message types
export const MessageTypes = {
  TEXT: 'text',
  IMAGE: 'image',
  TOOL_USE: 'tool_use',
  TOOL_RESULT: 'tool_result',
};

// Link types
export const LinkTypes = {
  SOURCE_CODE: 'source-code',
  CONTAINER_IMAGE: 'container-image',
  HOMEPAGE: 'homepage',
  DOCUMENTATION: 'documentation',
};

// Dependency types
export const DependencyTypes = {
  AGENT: 'agent',
  TOOL: 'tool',
  MODEL: 'model',
};

// ACP versions
export const ACPVersions = {
  V1_0_0: '1.0.0',
};

// Error codes
export const ErrorCodes = {
  INVALID_REQUEST: 'invalid_request',
  AGENT_NOT_FOUND: 'agent_not_found',
  RUN_NOT_FOUND: 'run_not_found',
  INTERNAL_ERROR: 'internal_error',
  TIMEOUT: 'timeout',
  CANCELLED: 'cancelled',
  VALIDATION_ERROR: 'validation_error',
};
