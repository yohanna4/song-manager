import { all } from 'redux-saga/effects';
import songsSaga from './songs/songSaga';

export default function* rootSaga() {
  yield all([songsSaga()]);
}
