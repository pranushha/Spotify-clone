import React from 'react';
import SongList from '../components/SongList';
import './Library.css';

const Library = ({ songs, playSong, currentSong }) => (
  <div className="library-root">
    <h2 className="library-title">Your Music</h2>
    {songs.length === 0 ? (
      <div className="library-empty">No songs in your library yet. Start adding your favorites!</div>
    ) : (
      <div className="library-list">
        <SongList songs={songs} playSong={playSong} currentSong={currentSong} />
      </div>
    )}
  </div>
);

export default Library; 