export interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
}

export interface SongsState {
  songs: Song[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}
