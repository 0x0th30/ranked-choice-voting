export interface VoteDTO {
  success: boolean,
  error?: Error,
}

export interface VoteHTTPResponse {
  success: boolean,
  message?: string
}
