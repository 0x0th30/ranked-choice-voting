export interface CreateVotingDTO {
  success: boolean,
  data?: { uuid: string },
  error?: Error,
}

export interface CreateVotingHTTPResponse {
  success: boolean,
  data?: { uuid: string },
  message?: string
}
