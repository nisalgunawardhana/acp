/**


 */

// Simple validation utilities without external dependencies

export function validateString(value, fieldName) {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  return value;
}

export function validateObject(value, fieldName) {
  if (typeof value !== 'object' || value === null) {
    throw new Error(`${fieldName} must be an object`);
  }
  return value;
}

export function validateArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  return value;
}

export function validateUrl(value, fieldName) {
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(`${fieldName} must be a valid URL`);
  }
}

export function validateEmail(value, fieldName) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new Error(`${fieldName} must be a valid email`);
  }
  return value;
}

// Parse and validate JSON responses
export function parseResponse(data, validator) {
  if (validator) {
    return validator(data);
  }
  return data;
}

// Basic schema validation for responses
export function validatePingResponse(data) {
  validateObject(data, 'PingResponse');
  return data;
}

export function validateAgentsListResponse(data) {
  validateObject(data, 'AgentsListResponse');
  validateArray(data.agents, 'agents');
  return data;
}

export function validateRunCreateResponse(data) {
  validateObject(data, 'RunCreateResponse');
  validateString(data.id, 'run id');
  return data;
}

export function validateRunReadResponse(data) {
  validateObject(data, 'RunReadResponse');
  validateString(data.id, 'run id');
  return data;
}

export function validateRunEventsListResponse(data) {
  validateObject(data, 'RunEventsListResponse');
  validateArray(data.events, 'events');
  return data;
}

export function validateEvent(data) {
  validateObject(data, 'Event');
  validateString(data.type, 'event type');
  return data;
}

export function validateErrorModel(data) {
  validateObject(data, 'ErrorModel');
  return data;
}
