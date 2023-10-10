export interface ExtractResultsDTO {
  success: boolean,
  data?: {
    winner: string,
    voteCount: {[key: string]: number}
  }
  error?: Error,
}

export interface ExtractResultsHTTPResponse {
  success: boolean,
  data?: {
    winner: string,
    voteCount: {[key: string]: number}
  }
  message?: string,
}
