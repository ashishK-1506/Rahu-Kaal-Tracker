export interface Coordinates {
  lat: number;
  lng: number;
  label?: string;
}

export interface RahuTime {
  start: Date;
  end: Date;
  date: Date;
}

export interface DailyData {
  date: Date;
  sunrise: Date;
  sunset: Date;
  rahu: RahuTime;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ApiError {
  message: string;
}

export interface CitySearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}