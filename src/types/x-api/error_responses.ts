/**
 * Associated with the following errors:
 * - A generic problem with no additional information beyond that provided by the HTTP status code.
 * - Your client has gone away.
 * - You cannot create a new job if one is already in progress.
 * - The rule you have submitted is invalid.
 * - A problem that indicates the user's rule set is not compliant.
 * - A problem that indicates your client application does not have the required OAuth1 permissions for the requested endpoint.
 * - You have exceeded the maximum number of rules.
 * - A problem that indicates that the authentication used is not supported.
 */
export interface IGenericError {
  title: string;
  type: string;
  detail?: string;
  status?: number;
}

/**
 * A problem that indicates your client is forbidden from making this request.
 */
export interface IForbiddenError extends IGenericError {
  reason?: 'official-client-forbidden' | 'client-not-enrolled';
  registration_url?: string;
}

/**
 * A problem that indicates that the resource requested violates the precepts of this API.
 */
export interface IResourceViolationError extends IGenericError {
  resource_id: string;
  resource_type: 'user' | 'tweet' | 'media' | 'list' | 'space';
  section: 'data' | 'includes';
}

/**
 * The rule you have submitted is a duplicate.
 */
export interface IDuplicateRuleError extends IGenericError {
  id?: string;
  value?: string;
}

/**
 * A problem that indicates this request is invalid.
 */
export interface IInvalidRequestError extends IGenericError {
  errors?: Array<{
    message?: string;
    parameters?: Record<string, string|string[]>;
  }>;
}

/**
 * A problem that indicates that you are not allowed to see a particular field on a Tweet, User, etc.
 */
export interface IForbiddenFieldAccessError extends IGenericError {
  field: string;
  resource_type: 'user' | 'tweet' | 'media' | 'list' | 'space';
  section: 'data' | 'includes';
}

/**
 * A problem that indicates you are not allowed to see a particular Tweet, User, etc.
 */
export interface IForbiddenResourceAccessError extends IGenericError {
  parameter: string;
  resource_id: string;
  resource_type: 'user' | 'tweet' | 'media' | 'list' | 'space';
  section: 'data' | 'includes';
  value: string;
}

/**
 * You have been disconnected for operational reasons.
 */
export interface IDisconnectedError extends IGenericError {
  disconnect_type: 'OperationalDisconnect' | 'UpstreamOperationalDisconnect' | 'ForceDisconnect' | 'UpstreamUncleanDisconnect' | 'SlowReader' | 'InternalError' | 'ClientApplicationStateDegraded' | 'InvalidRules';
}

/**
 * A problem that indicates that a given Tweet, User, etc. does not exist.
 */
export interface IResourceNotFoundError extends IGenericError {
  parameter: string;
  resource_id: string;
  resource_type: 'user' | 'tweet' | 'media' | 'list' | 'space';
  value: string;
}

/**
 * A problem that indicates a particular Tweet, User, etc. is not available to you.
 */
export interface IResourceNotAvailableToYouError extends IGenericError {
  parameter: string;
  resource_id: string;
  resource_type: 'user' | 'tweet' | 'media' | 'list' | 'space';
}

/**
 * A problem that indicates something is wrong with the connection.
 */
export interface IConnectionIssueError extends IGenericError {
  connection_issue?: 'TooManyConnections' | 'ProvisioningSubscription' | 'RuleConfigurationIssue' | 'RulesInvalidIssue';
}

/**
 * A problem that indicates that a usage cap has been exceeded.
 */
export interface IUsageCapExceededError extends IGenericError {
  period?: 'Daily' | 'Monthly';
  scope?: 'Account' | 'Product';
}

/**
 * The error responses from the Twitter API.
 * Content-Type: application/problem+json
 */
export type IXError = 
  | IGenericError
  | IForbiddenError
  | IResourceViolationError
  | IDuplicateRuleError
  | IInvalidRequestError
  | IForbiddenFieldAccessError
  | IForbiddenResourceAccessError
  | IDisconnectedError
  | IResourceNotFoundError
  | IResourceNotAvailableToYouError
  | IConnectionIssueError
  | IUsageCapExceededError;

/**
 * The request has failed.
 * Content-Type: application/json
 */
export interface RequestFailedError {
  code: string;
  message: string;
}
