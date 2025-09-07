import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as songsApi from "../../api/songsApi";
import {
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
} from "./songsSlice";
import type { Song } from "../../types/SongTypes";

function* fetchSongsSaga() {
  try {
    const { data, pagination }: { data: Song[]; pagination: any } = yield call(
      songsApi.fetchSongs
    );
    yield put(fetchSongsSuccess({ data, pagination }));
  } catch (error: any) {
    yield put(fetchSongsFailure(error.message || "Failed to fetch songs"));
  }
}

function* createSongSaga(action: PayloadAction<Omit<Song, "id">>) {
  try {
    const newSong: Song = yield call(songsApi.createSong, action.payload);
    yield put(createSongSuccess(newSong));
  } catch (error: any) {
    yield put(createSongFailure(error.message || "Failed to create song"));
  }
}

function* updateSongSaga(action: PayloadAction<{ _id: string; song: Partial<Song> }>) {
  try {
    const updatedSong: Song = yield call(songsApi.updateSong, action.payload._id, action.payload.song);
    yield put(updateSongSuccess(updatedSong));
  } catch (error: any) {
    yield put(updateSongFailure(error.message || "Failed to update song"));
  }
}


function* deleteSongSaga(action: PayloadAction<string>) {
  try {
    yield call(songsApi.deleteSong, action.payload);
    yield put(deleteSongSuccess(action.payload));
  } catch (error: any) {
    yield put(deleteSongFailure(error.message || "Failed to delete song"));
  }
}

export default function* songsSaga() {
  yield takeLatest(fetchSongsStart.type, fetchSongsSaga);
  yield takeLatest(createSongStart.type, createSongSaga);
  yield takeLatest(updateSongStart.type, updateSongSaga);
  yield takeLatest(deleteSongStart.type, deleteSongSaga);
}
