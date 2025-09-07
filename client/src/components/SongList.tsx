import React, { useState } from "react";
import styled from "@emotion/styled";
import type { Song } from "../types/SongTypes";

interface SongListProps {
  songs: Song[];
  onCreate: (song: Omit<Song, "_id">) => void;
  onUpdate: (song: Song) => void;
  onDelete: (id: string) => void;
}

const SongListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SongListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 8px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-family: "Inter", sans-serif;
  color: #374151;
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const SongInfo = styled.span`
  flex-grow: 1;
  margin-right: 10px;
`;

const SongDetails = styled.span`
  font-size: 0.85rem;
  color: #6b7280;
  white-space: nowrap;
  flex-shrink: 0;
`;

const SongActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
`;

const NoSongsMessage = styled.p`
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 20px;
  font-family: "Inter", sans-serif;
`;

const ActionButton = styled.button`
  background: #3b82f6;
  border: none;
  color: white;
  font-size: 0.8rem;
  padding: 4px 10px;
  margin-left: 6px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #2563eb;
  }

  &.delete {
    background: #ef4444;
    &:hover {
      background: #dc2626;
    }
  }
`;

// --- Modal Styles ---
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  min-width: 320px;
  max-width: 90%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin-bottom: 15px;
  font-family: "Inter", sans-serif;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-family: "Inter", sans-serif;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem; /* optional spacing above the list */
`;

const FilterContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Selects = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-family: "Inter", sans-serif;
`;

const SongList: React.FC<SongListProps> = ({
  songs,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Song, "_id">>({
    title: "",
    artist: "",
    album: "",
    genre: "",
  });
  const [editSong, setEditSong] = useState<Song | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // New state for genre filter
  const [selectedGenre, setSelectedGenre] = useState<string>("All");

  const openCreateModal = () => {
    setEditSong(null);
    setFormData({ title: "", artist: "", album: "", genre: "" });
    setModalOpen(true);
  };

  const openEditModal = (song: Song) => {
    setEditSong(song);
    setFormData({
      title: song.title,
      artist: song.artist,
      album: song.album,
      genre: song.genre,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editSong) {
      onUpdate({ ...editSong, ...formData });
    } else {
      onCreate(formData);
    }
    setModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      onDelete(deleteId);
      setDeleteId(null);
    }
    setDeleteModalOpen(false);
  };

  // Filter songs by selected genre
  const filteredSongs =
    selectedGenre === "All"
      ? songs
      : songs.filter((song) => song.genre === selectedGenre);

  // Get unique genres for dropdown
  const genres = Array.from(new Set(songs.map((song) => song.genre)));

  if (!songs || songs.length === 0) {
    return (
      <>
        <NoSongsMessage>
          🎶 No songs available to display. Add some to get started!
        </NoSongsMessage>
        <ActionButton onClick={openCreateModal}>+ Add Song</ActionButton>
      </>
    );
  }

  return (
    <>
      <AddButtonContainer>
        <ActionButton onClick={openCreateModal}>+ Add Song</ActionButton>
      </AddButtonContainer>

      {/* Genre Filter */}
      <FilterContainer>
        <label htmlFor="genreFilter">Filter by genre:</label>
        <Selects
          id="genreFilter"
          value={selectedGenre}
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setSelectedGenre(e.target.value)
          }
        >
          <option value="All">All</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </Selects>
      </FilterContainer>

      <SongListContainer>
        {filteredSongs.map((song) => (
          <SongListItem key={song._id}>
            <SongInfo>
              <strong>{song.title}</strong> by {song.artist}
            </SongInfo>
            <SongDetails>
              {song.album} | {song.genre}
            </SongDetails>
            <SongActions>
              <ActionButton onClick={() => openEditModal(song)}>
                Edit
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={() => {
                  setDeleteId(song._id);
                  setDeleteModalOpen(true);
                }}
              >
                Delete
              </ActionButton>
            </SongActions>
          </SongListItem>
        ))}
      </SongListContainer>

      {/* Modals (same as before) */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>{editSong ? "Edit Song" : "Add New Song"}</ModalTitle>
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Input
              placeholder="Artist"
              value={formData.artist}
              onChange={(e) =>
                setFormData({ ...formData, artist: e.target.value })
              }
            />
            <Input
              placeholder="Album"
              value={formData.album}
              onChange={(e) =>
                setFormData({ ...formData, album: e.target.value })
              }
            />
            <Input
              placeholder="Genre"
              value={formData.genre}
              onChange={(e) =>
                setFormData({ ...formData, genre: e.target.value })
              }
            />
            <ModalActions>
              <ActionButton type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </ActionButton>
              <ActionButton type="button" onClick={handleSave}>
                {editSong ? "Update" : "Create"}
              </ActionButton>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      {isDeleteModalOpen && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>Delete this song?</ModalTitle>
            <p>This action cannot be undone.</p>
            <ModalActions>
              <ActionButton
                type="button"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </ActionButton>
              <ActionButton
                type="button"
                className="delete"
                onClick={handleDeleteConfirm}
              >
                Delete
              </ActionButton>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </>
  );
};

export default SongList;
