
export interface SearchSource {
  uri: string;
  title: string;
}

export interface SummaryData {
  text: string;
  sources: SearchSource[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
