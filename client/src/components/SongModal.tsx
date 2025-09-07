/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import type { Song } from "../types/SongTypes";

type Mode = "create" | "edit" | "delete";

interface SongModalProps {
  isOpen: boolean;
  mode: Mode;
  onClose: () => void;
  onConfirm: (data?: Omit<Song, "_id">) => void;
  initialData?: Song | null;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.25s ease;
  font-family: "Inter", sans-serif;

  @keyframes fadeIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 1.4rem;
  font-weight: 600;
  text-align: center;
  color: #1f2937;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  &:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
`;

const Message = styled.p`
  font-size: 1rem;
  color: #374151;
  text-align: center;
  margin: 15px 0;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
`;

const Button = styled.button<{ variant?: "primary" | "danger" | "secondary" }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;

  background: ${(p) =>
    p.variant === "primary"
      ? "#2563eb"
      : p.variant === "danger"
      ? "#dc2626"
      : "#e5e7eb"};
  color: ${(p) =>
    p.variant === "primary" || p.variant === "danger" ? "#fff" : "#374151"};

  &:hover {
    background: ${(p) =>
      p.variant === "primary"
        ? "#1d4ed8"
        : p.variant === "danger"
        ? "#b91c1c"
        : "#d1d5db"};
  }
`;

const SongModal: React.FC<SongModalProps> = ({
  isOpen,
  mode,
  onClose,
  onConfirm,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title);
      setArtist(initialData.artist);
      setAlbum(initialData.album);
      setGenre(initialData.genre);
    } else if (mode === "create") {
      setTitle("");
      setArtist("");
      setAlbum("");
      setGenre("");
    }
  }, [mode, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create" || mode === "edit") {
      onConfirm({title, artist, album, genre });
    } else {
      onConfirm();
    }
    onClose();
  };

  return (
    <Overlay>
      <ModalContainer>
        <Title>
          {mode === "create"
            ? "Add New Song"
            : mode === "edit"
            ? "Edit Song"
            : "Delete Song"}
        </Title>

        {mode === "delete" ? (
          <>
            <Message>
              Are you sure you want to delete{" "}
              <strong>{initialData?.title}</strong> by{" "}
              <strong>{initialData?.artist}</strong>?
            </Message>
            <Actions>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="danger" onClick={handleSubmit}>
                Delete
              </Button>
            </Actions>
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Song Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Album"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />

            <Actions>
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {mode === "create" ? "Add Song" : "Save Changes"}
              </Button>
            </Actions>
          </Form>
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default SongModal;
