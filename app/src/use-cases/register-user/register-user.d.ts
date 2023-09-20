export interface RegisterUserDTO {
  success: boolean,
  data?: { uuid: string },
  error?: Error,
}

export interface RegisterUserHTTPResponse {
  success: boolean,
  data?: { uuid: string },
  message?: string
}
