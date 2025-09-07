import express from "express";
import {
  getSongs,
  getStats,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  getArtists,
  getAlbums,
  getGenres,
  getSongsPerArtist,
  getSongsPerAlbum,
} from "../controllers/songController.js";
import { restrictWriteMethods } from "../middleware/corsGuard.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

// stats
router.get("/stats", getStats);
router.get("/artists", restrictWriteMethods, validateRequest, getArtists);
router.get("/album", restrictWriteMethods, validateRequest, getAlbums);
router.get("/genre", restrictWriteMethods, validateRequest, getGenres);
router.get(
  "/songs-per-artist",
  restrictWriteMethods,
  validateRequest,
  getSongsPerArtist
);
router.get(
  "/songs-per-album",
  restrictWriteMethods,
  validateRequest,
  getSongsPerAlbum
);

// CRUD
router.get("/", restrictWriteMethods, validateRequest, getSongs);
router.get("/:id", restrictWriteMethods, validateRequest, getSongById);
router.post("/", restrictWriteMethods, validateRequest, createSong);
router.patch("/:id", restrictWriteMethods, validateRequest, updateSong);
router.delete("/:id", restrictWriteMethods, validateRequest, deleteSong);

export default router;
