export interface CreateVotingDTO {
  success: boolean,
  data?: { sessionId: string },
  error?: Error,
}

export interface CreateVotingHTTPResponse {
  success: boolean,
  data?: { sessionId: string },
  message?: string
}
