import type { Song } from "../types/SongTypes";
import api from "./axios";

export type ArtistStats = {
  artist: string;
  totalSongs: number;
  albumCount: number;
  albums: string[];
  songs: string[];
};

export type AlbumStats = {
  album: string;
  artist: string;
  totalSongs: number;
  songs: string[];
};

export type GenreStats = {
  genre: string;
  totalSongs: number;
  songs: string[];
};

export type Stats = {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
  songsPerGenre: GenreStats[];
  songsPerArtist: ArtistStats[];
  songsPerAlbum: AlbumStats[];
};

export type Pagination<T> = {
  page: number;
  limit: number;
  totalPages: number;
  data: T[];
};

export const fetchSongs = async (
  page = 1,
  limit = 10,
  filters?: { genre?: string; artist?: string; album?: string },
  sort = "-createdAt"
): Promise<{
  data: Song[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  const res = await api.get<{
    data: Song[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>("/song", {
    params: {
      page,
      limit,
      sort,
      ...filters,
    },
  });

  return res.data;
};

export const createSong = async (song: Omit<Song, "id">): Promise<Song> => {
  const res = await api.post<Song>("/song", song);
  return res.data;
};

export const updateSong = async (
  id: string,
  song: Partial<Song>
): Promise<Song> => {
  const res = await api.patch<Song>(`/song/${id}`, song)
  return res.data;
};

export const deleteSong = async (id: string): Promise<void> => {
  await api.delete(`/song/${id}`);
};

export const fetchStats = async (): Promise<Stats> => {
  const res = await api.get<Stats>("/song/stats");
  return res.data;
};

export const fetchArtists = async (
  page = 1,
  limit = 10,
  sortField = "totalSongs",
  sortOrder: "asc" | "desc" = "desc"
): Promise<Pagination<ArtistStats>> => {
  const res = await api.get<Pagination<ArtistStats>>("/artists", {
    params: { page, limit, sortField, sortOrder },
  });
  return res.data;
};

export const fetchAlbums = async (
  page = 1,
  limit = 10,
  sortField = "totalSongs",
  sortOrder: "asc" | "desc" = "desc"
): Promise<Pagination<AlbumStats>> => {
  const res = await api.get<Pagination<AlbumStats>>("/albums", {
    params: { page, limit, sortField, sortOrder },
  });
  return res.data;
};

export const fetchGenres = async (
  page = 1,
  limit = 10,
  sortField = "totalSongs",
  sortOrder: "asc" | "desc" = "desc"
): Promise<Pagination<GenreStats>> => {
  const res = await api.get<Pagination<GenreStats>>("/genres", {
    params: { page, limit, sortField, sortOrder },
  });
  return res.data;
};

export const fetchSongsPerArtist = async (
  page = 1,
  limit = 10,
  sortField = "totalSongs",
  sortOrder: "asc" | "desc" = "desc"
): Promise<Pagination<ArtistStats>> => {
  const res = await api.get<Pagination<ArtistStats>>("/songPerArtist", {
    params: { page, limit, sortField, sortOrder },
  });
  return res.data;
};

export const fetchSongsPerAlbum = async (
  page = 1,
  limit = 10,
  sortField = "totalSongs",
  sortOrder: "asc" | "desc" = "desc"
): Promise<Pagination<AlbumStats>> => {
  const res = await api.get<Pagination<AlbumStats>>("/songPerAlbum", {
    params: { page, limit, sortField, sortOrder },
  });
  return res.data;
};
