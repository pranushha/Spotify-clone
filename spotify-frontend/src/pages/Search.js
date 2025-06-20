import React from 'react';
import SongList from '../components/SongList';
import { Search as SearchIcon } from 'lucide-react';
import './Search.css';

const Search = ({ searchQuery, setSearchQuery, filteredSongs, playSong, currentSong }) => (
  <div className="search-root">
    <div className="search-bar-outer">
      <div className="search-bar-container">
        <SearchIcon size={22} className="search-bar-icon" />
        <input
          type="text"
          placeholder="What do you want to listen to?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar-input"
        />
      </div>
    </div>
    <div className="search-results">
      <SongList songs={filteredSongs} playSong={playSong} currentSong={currentSong} />
    </div>
  </div>
);

export default Search; 