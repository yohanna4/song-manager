import React from "react";
import styled from "@emotion/styled";
import type { Song } from "../types/SongTypes";

interface Props {
  songs: Song[];
}

const StatsContainer = styled.div`
  margin-top: 2rem;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', sans-serif;
`;

const StatsTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 10px;
`;

const StatCard = styled.div`
  background-color: #f9fafb;
  border-radius: 10px;
  padding: 16px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.03);
`;

const StatSectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatItem = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  margin-bottom: 6px;
  line-height: 1.5;
`;

const NoSongsMessage = styled.p`
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 40px;
  font-family: 'Inter', sans-serif;
`;

const Statistics: React.FC<Props> = ({ songs }) => {
  if (!songs || songs.length === 0) {
    return <NoSongsMessage>📊 No statistics to display. Add songs to see insights!</NoSongsMessage>;
  }

  const stats = songs.reduce(
    (acc, song) => {
      acc.totalSongs = songs.length;
      acc.artists[song.artist] = (acc.artists[song.artist] || 0) + 1;
      acc.albums[song.album] = (acc.albums[song.album] || 0) + 1;
      acc.genres[song.genre] = (acc.genres[song.genre] || 0) + 1;
      return acc;
    },
    {
      totalSongs: 0,
      artists: {} as Record<string, number>,
      albums: {} as Record<string, number>,
      genres: {} as Record<string, number>,
    }
  );

  return (
    <StatsContainer>
      <StatsTitle>📊 Song Statistics</StatsTitle>

      <StatCard>
        <StatSectionTitle>
          <span role="img" aria-label="music notes">🎵</span> Total Songs
        </StatSectionTitle>
        <StatItem>{stats.totalSongs}</StatItem>
      </StatCard>

      <StatGrid>
        <StatCard>
          <StatSectionTitle>
            <span role="img" aria-label="microphone">🎤</span> Artists
          </StatSectionTitle>
          {Object.entries(stats.artists).map(([artist, count]) => (
            <StatItem key={artist}>
              {artist}: {count}
            </StatItem>
          ))}
        </StatCard>

        <StatCard>
          <StatSectionTitle>
            <span role="img" aria-label="album">📀</span> Albums
          </StatSectionTitle>
          {Object.entries(stats.albums).map(([album, count]) => (
            <StatItem key={album}>
              {album}: {count}
            </StatItem>
          ))}
        </StatCard>

        <StatCard>
          <StatSectionTitle>
            <span role="img" aria-label="tag">🏷️</span> Genres
          </StatSectionTitle>
          {Object.entries(stats.genres).map(([genre, count]) => (
            <StatItem key={genre}>
              {genre}: {count}
            </StatItem>
          ))}
        </StatCard>
      </StatGrid>
    </StatsContainer>
  );
};

export default Statistics;
