/**


 */

export class BaseError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = this.constructor.name;
    if (cause) {
      this.cause = cause;
    }
  }
}

export class FetchError extends BaseError {
  constructor(message, response, options = {}) {
    super(message, options.cause);
    this.response = response;
  }
}

export class HTTPError extends BaseError {
  constructor(response, data) {
    super(`HTTP Error ${response.status}: ${response.statusText}`);
    this.response = response;
    this.data = data;
    this.status = response.status;
    this.statusText = response.statusText;
  }
}

export class ACPError extends BaseError {
  constructor(error) {
    super(error.message || 'ACP Error');
    this.error = error;
    this.code = error.code;
    this.type = error.type;
  }
}
