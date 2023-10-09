export interface ExtractResultsDTO {
  success: boolean,
  data?: {
    winner: string,
    voteCount: {[key: string]: string}
  }
  error?: Error,
}

export interface ExtractResultsHTTPResponse {
  success: boolean,
  data?: {
    winner: string,
    voteCount: {[key: string]: string}
  }
  message?: string,
}
