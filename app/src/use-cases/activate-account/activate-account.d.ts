export interface ActivateAccountDTO {
  success: boolean,
  error?: Error,
}

export interface ActivateAccountHTTPResponse {
  success: boolean,
  message?: string
}
