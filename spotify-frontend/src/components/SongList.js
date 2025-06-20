import React from 'react';
import { Heart } from 'lucide-react';
import './SongList.css';

const getRandomImg = (seed) => `https://source.unsplash.com/40x40/?music,album,cover&sig=${seed}`;

const SongList = ({ songs, playSong, currentSong }) => (
  <div className="song-list">
    <div className="song-list-header">
      <div></div>
      <div>#</div>
      <div>TITLE</div>
      <div>ALBUM</div>
      <div>DURATION</div>
      <div></div>
    </div>
    {songs.map((song, index) => (
      <div
        key={song.id}
        className={`song-list-row${currentSong?.id === song.id ? ' active' : ''}`}
        onClick={() => playSong(song)}
      >
        <div className="song-list-album-art">
          <img
            src={song.image || getRandomImg(song.id || index)}
            alt={song.title + ' album cover'}
            className="song-list-album-img"
            width={40}
            height={40}
          />
        </div>
        <div className="song-list-index">{index + 1}</div>
        <div>
          <div className={`song-list-title${currentSong?.id === song.id ? ' active' : ''}`}>{song.title}</div>
          <div className="song-list-artist">{song.artist}</div>
        </div>
        <div className="song-list-album">{song.album}</div>
        <div className="song-list-duration">{song.duration}</div>
        <div>
          <Heart size={16} className={`song-list-like${song.liked ? ' liked' : ''}`} />
        </div>
      </div>
    ))}
  </div>
);

export default SongList; 