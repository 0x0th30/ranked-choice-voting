export interface ExtractResultsDTO {
  success: boolean,
  data?: {
    winner: string,
    percentage: {[key: string]: string}
  }
  error?: Error,
}

export interface ExtractResultsHTTPResponse {
  success: boolean,
  data?: {
    winner: string,
    percentage: {[key: string]: string}
  }
  message?: string,
}
