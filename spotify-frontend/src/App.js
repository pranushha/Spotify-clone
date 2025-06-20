import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import './App.css';

const SpotifyClone = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef(null);

  // Sample data
  const playlists = [
    { id: 1, name: 'Liked Songs', songs: 234, image: '🎵' },
    { id: 2, name: 'My Playlist #1', songs: 45, image: '🎶' },
    { id: 3, name: 'Chill Vibes', songs: 67, image: '🌙' },
    { id: 4, name: 'Workout Mix', songs: 89, image: '💪' }
  ];

  const songs = [
    { id: 1, title: 'Song One', artist: 'Artist A', album: 'Album X', duration: '3:45', liked: true, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=600&q=80' },
    { id: 2, title: 'Another Track', artist: 'Artist B', album: 'Album Y', duration: '4:20', liked: false, image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=600&q=80' },
    { id: 3, title: 'Music Piece', artist: 'Artist C', album: 'Album Z', duration: '2:58', liked: true, image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=600&q=80' },
    { id: 4, title: 'Sound Wave', artist: 'Artist D', album: 'Album W', duration: '5:12', liked: false, image: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=facearea&w=600&q=80' },
    { id: 5, title: 'Beat Drop', artist: 'Artist E', album: 'Album V', duration: '3:33', liked: true, image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=facearea&w=600&q=80' }
  ];

  const recentlyPlayed = [
    { id: 1, name: "Today's Top Hits", type: 'playlist', image: '🔥' },
    { id: 2, name: 'RapCaviar', type: 'playlist', image: '🎤' },
    { id: 3, name: 'Pop Rising', type: 'playlist', image: '⭐' },
    { id: 4, name: 'Jazz Classics', type: 'playlist', image: '🎷' },
    { id: 5, name: 'Rock Anthems', type: 'playlist', image: '🤘' },
    { id: 6, name: 'Indie Folk', type: 'playlist', image: '🍃' }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [currentSong]);

  // Custom cursor logic
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');
    const moveCursor = (e) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="custom-cursor" />
      <div style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} playlists={playlists} />

        {/* Main Content */}
        <div style={{
          flex: 1,
          backgroundColor: '#121212',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Bar (Search input is now in Search page) */}
          <div style={{
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: '#121212',
            borderBottom: '1px solid #282828'
          }}>
            {/* Reserved for future top bar content */}
          </div>
          {/* Content Area */}
          <div style={{
            flex: 1,
            padding: '32px',
            overflowY: 'auto'
          }}>
            {activeTab === 'home' && (
              <Home recentlyPlayed={recentlyPlayed} />
            )}
            {activeTab === 'search' && (
              <Search
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredSongs={filteredSongs}
                playSong={playSong}
                currentSong={currentSong}
              />
            )}
            {activeTab === 'library' && (
              <Library
                songs={songs}
                playSong={playSong}
                currentSong={currentSong}
              />
            )}
          </div>
        </div>

        {/* Player */}
        {currentSong && (
          <Player
            currentSong={currentSong}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            currentTime={currentTime}
            duration={duration}
            formatTime={formatTime}
            volume={volume}
          />
        )}
        <audio ref={audioRef} />
      </div>
    </>
  );
};

export default SpotifyClone;