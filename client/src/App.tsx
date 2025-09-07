import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import SongList from "./components/SongList";
import Statistics from "./components/Statistics";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSongsStart,
  createSongStart,
  updateSongStart,
  deleteSongStart,
} from "./redux/songs/songsSlice";
import type { RootState, AppDispatch } from "./redux/store";
import type { Song } from "./types/SongTypes";

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-top: 2rem;
  font-family: "Inter", sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #083a81ff;
  text-align: center;
  margin-bottom: 1.5rem;
  font-family: "Inter", sans-serif;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background: ${({ active }) => (active ? "#3b82f6" : "#e5e7eb")};
  color: ${({ active }) => (active ? "#ffffff" : "#374151")};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 0 5px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ active }) => (active ? "#2563eb" : "#d1d5db")};
  }
`;

const App: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  const songs: Song[] = useSelector(
    (state: RootState) => state.songs.songs || []
  );

  useEffect(() => {
    dispatch(fetchSongsStart());
  }, [dispatch]);

  const handleCreate = (newSong: Omit<Song, "_id">) => {
    dispatch(createSongStart(newSong));
  };

  const handleUpdate = (updatedSong: Song) => {
    dispatch(updateSongStart({ _id: updatedSong._id, song: updatedSong }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteSongStart(id));
  };

  return (
    <Container>
      <Title>Song Manager</Title>

      <TabsContainer>
        <TabButton active={tabIndex === 0} onClick={() => setTabIndex(0)}>
          Songs List
        </TabButton>
        <TabButton active={tabIndex === 1} onClick={() => setTabIndex(1)}>
          Statistics
        </TabButton>
      </TabsContainer>

      {tabIndex === 0 && (
        <SongList
          songs={songs}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      {tabIndex === 1 && <Statistics songs={songs} />}
    </Container>
  );
};

export default App;
