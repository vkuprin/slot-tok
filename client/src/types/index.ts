export interface Video {
  id: string;
  url: string;
  thumbnail: string;
  duration: number;
}

export interface VideoState {
  videos: Video[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
}

export interface SlotSymbol {
  id: number;
  name: string;
  symbol: string;
  value: number;
}

export interface SlotResult {
  combination: number[];
  isWin: boolean;
  winAmount?: number;
}
