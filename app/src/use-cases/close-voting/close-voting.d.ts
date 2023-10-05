export interface CloseVotingDTO {
  success: boolean,
  data?: { uuid: string },
  error?: Error,
}

export interface CloseVotingHTTPResponse {
  success: boolean,
  data?: { uuid: string },
  message?: string
}
