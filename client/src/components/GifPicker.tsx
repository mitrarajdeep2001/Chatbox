import React, { useState, useCallback } from "react";
import { Grid } from "@giphy/react-components";
import gf from "@/lib/giphyInstance";
import { Modal } from "@mui/material";
import { debounce } from "@/lib/utils";

// Fetch trending GIFs
const fetchTrendingGifs = (offset: number) =>
  gf.trending({ offset, limit: 10 });

// Fetch GIFs based on a search query
const fetchSearchGifs = (query: string, offset: number) =>
  gf.search(query, { offset, limit: 10 });

const GifPicker = ({
  onGifSelect,
  open,
  onClose,
}: {
  onGifSelect: (gifUrl: string) => void;
  open: boolean;
  onClose: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Handle search input change with debounce
  const handleSearchChange = useCallback(
    debounce((query: string) => {
      setDebouncedQuery(query); // Update the debounced query
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query); // Update the immediate search query for the input
    handleSearchChange(query); // Trigger debounced query update
  };

  const getFetchGifs = useCallback(
    (offset: number) =>
      debouncedQuery
        ? fetchSearchGifs(debouncedQuery, offset)
        : fetchTrendingGifs(offset),
    [debouncedQuery]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="gif-picker-modal"
      aria-describedby="select-a-gif"
    >
      <div className="gif-main-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search GIFs"
          className="gif-input"
        />
        <div className="gif-container rounded-scrollbar">
          <Grid
            width={460} // Adjust grid width to fit inside the modal
            columns={3}
            fetchGifs={getFetchGifs}
            key={debouncedQuery}
            onGifClick={(gif, e) => {
              e.preventDefault();
              onGifSelect(gif.images.original.url); // Send the selected GIF URL
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default GifPicker;
