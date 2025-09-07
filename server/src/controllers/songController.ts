import { Request, Response } from "express";
import Song from "../models/Song.js";

export const getSongs = async (req: Request, res: Response) => {
  try {
    const {
      genre,
      artist,
      album,
      sort = "createdAt",
      page = "1",
      limit = "10",
    } = req.query;

    const filter: any = {};
    if (genre) filter.genre = genre;
    if (artist) filter.artist = artist;
    if (album) filter.album = album;

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Fetch songs with pagination and sorting
    const songs = await Song.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(pageSize);

    // Total count for pagination
    const total = await Song.countDocuments(filter);

    res.json({
      data: songs,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch songs", details: err });
  }
};

export const getSongById = async (req: Request, res: Response) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ error: "Song not found" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch song", details: err });
  }
};

export const createSong = async (req: Request, res: Response) => {
  try {
    const { title, artist, album, genre, releaseDate } = req.body;
    const newSong = new Song({ title, artist, album, genre, releaseDate });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (err) {
    res.status(400).json({ error: "Failed to create song", err });
  }
};

export const updateSong = async (req: Request, res: Response) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedSong) return res.status(404).json({ error: "Song not found" });
    res.json(updatedSong);
  } catch (err) {
    res.status(400).json({ error: "Failed to update song", details: err });
  }
};

export const deleteSong = async (req: Request, res: Response) => {
  try {
    const deleted = await Song.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Song not found" });
    res.json({ message: "Song deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete song" });
  }
};

// STATS
export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await Song.aggregate([
      {
        $facet: {
          totalCounts: [
            {
              $group: {
                _id: null,
                totalSongs: { $sum: 1 },
                totalArtists: { $addToSet: "$artist" },
                totalAlbums: { $addToSet: "$album" },
                totalGenres: { $addToSet: "$genre" },
              },
            },
          ],
          songsPerGenre: [{ $group: { _id: "$genre", count: { $sum: 1 } } }],
          songsPerArtist: [
            {
              $group: {
                _id: "$artist",
                songs: { $push: "$title" },
                albums: { $addToSet: "$album" },
              },
            },
            {
              $project: {
                artist: "$_id",
                totalSongs: { $size: "$songs" },
                albumCount: { $size: "$albums" },
                albums: 1,
              },
            },
          ],
          songsPerAlbum: [
            {
              $group: {
                _id: "$album",
                artist: { $first: "$artist" },
                totalSongs: { $sum: 1 },
                songs: { $push: "$title" },
              },
            },
          ],
        },
      },
    ]);

    const totals = stats[0].totalCounts[0] || {
      totalSongs: 0,
      totalArtists: [],
      totalAlbums: [],
      totalGenres: [],
    };

    res.json({
      totalSongs: totals.totalSongs,
      totalArtists: totals.totalArtists.length,
      totalAlbums: totals.totalAlbums.length,
      totalGenres: totals.totalGenres.length,
      songsPerGenre: stats[0].songsPerGenre,
      songsPerArtist: stats[0].songsPerArtist,
      songsPerAlbum: stats[0].songsPerAlbum,
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating stats", error });
  }
};

export const getArtists = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortField = (req.query.sortField as string) || "totalSongs";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const aggregate = Song.aggregate([
      {
        $group: {
          _id: "$artist",
          totalSongs: { $sum: 1 },
          albums: { $addToSet: "$album" },
          songs: { $push: "$title" },
        },
      },
      {
        $project: {
          artist: "$_id",
          totalSongs: 1,
          albumCount: { $size: "$albums" },
          albums: 1,
          songs: 1,
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const results = await aggregate.exec();

    const totalArtists = await Song.distinct("artist").then(
      (arr) => arr.length
    );

    res.json({
      page,
      limit,
      totalArtists,
      totalPages: Math.ceil(totalArtists / limit),
      data: results,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch artists", error });
  }
};

export const getAlbums = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortField = (req.query.sortField as string) || "totalSongs";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const aggregate = Song.aggregate([
      {
        $group: {
          _id: "$album",
          artist: { $first: "$artist" },
          totalSongs: { $sum: 1 },
          songs: { $push: "$title" },
        },
      },
      {
        $project: {
          album: "$_id",
          artist: 1,
          totalSongs: 1,
          songs: 1,
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const results = await aggregate.exec();
    const totalAlbums = await Song.distinct("album").then((arr) => arr.length);

    res.json({
      page,
      limit,
      totalAlbums,
      totalPages: Math.ceil(totalAlbums / limit),
      data: results,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch albums", error });
  }
};

export const getGenres = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortField = (req.query.sortField as string) || "totalSongs";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const aggregate = Song.aggregate([
      {
        $group: {
          _id: "$genre",
          totalSongs: { $sum: 1 },
          songs: { $push: "$title" },
        },
      },
      {
        $project: {
          genre: "$_id",
          totalSongs: 1,
          songs: 1,
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const results = await aggregate.exec();
    const totalGenres = await Song.distinct("genre").then((arr) => arr.length);

    res.json({
      page,
      limit,
      totalGenres,
      totalPages: Math.ceil(totalGenres / limit),
      data: results,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch genres", error });
  }
};

export const getSongsPerArtist = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortField = (req.query.sortField as string) || "totalSongs";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? 1 : -1;

    // Aggregate songs grouped by artist
    const aggregate = Song.aggregate([
      {
        $group: {
          _id: "$artist",
          totalSongs: { $sum: 1 },
          albums: { $addToSet: "$album" },
          songs: { $push: "$title" },
        },
      },
      {
        $project: {
          artist: "$_id",
          totalSongs: 1,
          albumCount: { $size: "$albums" },
          albums: 1,
          songs: 1,
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const results = await aggregate.exec();

    const totalArtists = await Song.distinct("artist").then(
      (arr) => arr.length
    );

    res.json({
      page,
      limit,
      totalArtists,
      totalPages: Math.ceil(totalArtists / limit),
      data: results,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch songs per artist", error });
  }
};

export const getSongsPerAlbum = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortField = (req.query.sortField as string) || "totalSongs";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? 1 : -1;

    const aggregate = Song.aggregate([
      {
        $group: {
          _id: "$album",
          artist: { $first: "$artist" },
          totalSongs: { $sum: 1 },
          songs: { $push: "$title" },
        },
      },
      {
        $project: {
          album: "$_id",
          artist: 1,
          totalSongs: 1,
          songs: 1,
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const results = await aggregate.exec();

    const totalAlbums = await Song.distinct("album").then((arr) => arr.length);

    res.json({
      page,
      limit,
      totalAlbums,
      totalPages: Math.ceil(totalAlbums / limit),
      data: results,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch songs per album", error });
  }
};
