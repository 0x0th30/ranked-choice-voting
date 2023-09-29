export interface SendActivationLinkDTO {
  success: boolean,
  error?: Error,
}

export interface SendActivationLinkHTTPResponse {
  success: boolean,
  message?: string
}
