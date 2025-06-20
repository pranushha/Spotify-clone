import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Shuffle, Repeat } from 'lucide-react';
import './Player.css';

const Player = ({ currentSong, isPlaying, togglePlayPause, currentTime, duration, formatTime, volume }) => (
  <div className="player">
    {/* Song Info */}
    <div className="player-song-info">
      {currentSong.image ? (
        <img
          src={currentSong.image}
          alt={currentSong.title + ' album cover'}
          className="player-song-art-img"
        />
      ) : (
        <div className="player-song-art">🎵</div>
      )}
      <div>
        <div className="player-song-title">{currentSong.title}</div>
        <div className="player-song-artist">{currentSong.artist}</div>
      </div>
      <Heart size={16} style={{ color: currentSong.liked ? '#1db954' : '#b3b3b3', cursor: 'pointer' }} />
    </div>
    {/* Controls */}
    <div className="player-controls">
      <div className="player-controls-row">
        <Shuffle size={16} style={{ color: '#b3b3b3', cursor: 'pointer' }} />
        <SkipBack size={16} style={{ color: '#b3b3b3', cursor: 'pointer' }} />
        <div className="player-play-btn" onClick={togglePlayPause}>
          {isPlaying ? <Pause size={14} style={{ color: '#000' }} /> : <Play size={14} style={{ color: '#000' }} />}
        </div>
        <SkipForward size={16} style={{ color: '#b3b3b3', cursor: 'pointer' }} />
        <Repeat size={16} style={{ color: '#b3b3b3', cursor: 'pointer' }} />
      </div>
      <div className="player-progress-row">
        <span className="player-time">{formatTime(currentTime)}</span>
        <div className="player-progress-bar">
          <div className="player-progress" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
        </div>
        <span className="player-time">{currentSong.duration}</span>
      </div>
    </div>
    {/* Volume */}
    <div className="player-volume-row">
      <Volume2 size={16} style={{ color: '#b3b3b3' }} />
      <div className="player-volume-bar">
        <div className="player-volume" style={{ width: `${volume * 100}%` }} />
      </div>
    </div>
  </div>
);

export default Player; 