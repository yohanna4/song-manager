import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "../../types/SongTypes";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SongsState {
  songs: Song[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: SongsState = {
  songs: [],
  pagination: null,
  loading: false,
  error: null,
};

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    // ----- FETCH -----
    fetchSongsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSongsSuccess(state, action: PayloadAction<{ data: Song[]; pagination: Pagination }>) {
      state.songs = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = false;
    },
    fetchSongsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // ----- CREATE -----
    createSongStart(state, _action: PayloadAction<Omit<Song, "_id">>) {
      state.loading = true;
      state.error = null;
    },
    createSongSuccess(state, action: PayloadAction<Song>) {
      state.songs = [action.payload, ...state.songs]; // prepend
      state.loading = false;
    },
    createSongFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // ----- UPDATE -----
    updateSongStart(state, _action: PayloadAction<{ _id: string; song: Partial<Song> }>) {
      state.loading = true;
      state.error = null;
    },
    updateSongSuccess(state, action: PayloadAction<Song>) {
      state.songs = state.songs.map((s) => (s._id === action.payload._id ? action.payload : s));
      state.loading = false;
    },
    updateSongFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // ----- DELETE -----
    deleteSongStart(state, _action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    deleteSongSuccess(state, action: PayloadAction<string>) {
      state.songs = state.songs.filter((s) => s._id !== action.payload);
      state.loading = false;
    },
    deleteSongFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSongsStart,
  fetchSongsSuccess,
  fetchSongsFailure,
  createSongStart,
  createSongSuccess,
  createSongFailure,
  updateSongStart,
  updateSongSuccess,
  updateSongFailure,
  deleteSongStart,
  deleteSongSuccess,
  deleteSongFailure,
} = songsSlice.actions;

export default songsSlice.reducer;
