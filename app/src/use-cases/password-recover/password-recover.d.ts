export interface PasswordRecoverDTO {
  success: boolean,
  error?: Error,
}

export interface PasswordRecoverHTTPResponse {
  success: boolean,
  message?: string
}
