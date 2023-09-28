export interface AuthUserDTO {
  success: boolean,
  data?: { token: string },
  error?: Error,
}

export interface AuthUserHTTPResponse {
  success: boolean,
  message?: string
}
