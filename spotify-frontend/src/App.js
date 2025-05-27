import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Search, Home, Library, Plus, Shuffle, Repeat } from 'lucide-react';

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
    { id: 1, title: 'Song One', artist: 'Artist A', album: 'Album X', duration: '3:45', liked: true },
    { id: 2, title: 'Another Track', artist: 'Artist B', album: 'Album Y', duration: '4:20', liked: false },
    { id: 3, title: 'Music Piece', artist: 'Artist C', album: 'Album Z', duration: '2:58', liked: true },
    { id: 4, title: 'Sound Wave', artist: 'Artist D', album: 'Album W', duration: '5:12', liked: false },
    { id: 5, title: 'Beat Drop', artist: 'Artist E', album: 'Album V', duration: '3:33', liked: true }
  ];

  const recentlyPlayed = [
    { id: 1, name: 'Today\'s Top Hits', type: 'playlist', image: '🔥' },
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
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '240px',
        backgroundColor: '#000',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        {/* Logo */}
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1db954'
        }}>
          Spotify
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div 
            onClick={() => setActiveTab('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '8px 0',
              cursor: 'pointer',
              color: activeTab === 'home' ? '#fff' : '#b3b3b3',
              fontSize: '14px',
              fontWeight: activeTab === 'home' ? 'bold' : 'normal'
            }}
          >
            <Home size={24} />
            Home
          </div>
          <div 
            onClick={() => setActiveTab('search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '8px 0',
              cursor: 'pointer',
              color: activeTab === 'search' ? '#fff' : '#b3b3b3',
              fontSize: '14px',
              fontWeight: activeTab === 'search' ? 'bold' : 'normal'
            }}
          >
            <Search size={24} />
            Search
          </div>
          <div 
            onClick={() => setActiveTab('library')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '8px 0',
              cursor: 'pointer',
              color: activeTab === 'library' ? '#fff' : '#b3b3b3',
              fontSize: '14px',
              fontWeight: activeTab === 'library' ? 'bold' : 'normal'
            }}
          >
            <Library size={24} />
            Your Library
          </div>
        </div>

        {/* Create Playlist */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '8px 0',
          cursor: 'pointer',
          color: '#b3b3b3',
          fontSize: '14px'
        }}>
          <Plus size={24} />
          Create Playlist
        </div>

        {/* Playlists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
          {playlists.map(playlist => (
            <div key={playlist.id} style={{
              cursor: 'pointer',
              color: '#b3b3b3',
              fontSize: '14px',
              padding: '4px 0'
            }}>
              {playlist.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Bar */}
        <div style={{
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: '#121212',
          borderBottom: '1px solid #282828'
        }}>
          {activeTab === 'search' && (
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '10px', color: '#b3b3b3' }} />
              <input
                type="text"
                placeholder="What do you want to listen to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 8px 8px 40px',
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          padding: '32px',
          overflowY: 'auto'
        }}>
          {activeTab === 'home' && (
            <div>
              <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>Recently played</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '24px',
                marginBottom: '48px'
              }}>
                {recentlyPlayed.map(item => (
                  <div key={item.id} style={{
                    backgroundColor: '#181818',
                    padding: '16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    ':hover': { backgroundColor: '#282828' }
                  }}>
                    <div style={{
                      width: '100%',
                      aspectRatio: '1',
                      backgroundColor: '#333',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      marginBottom: '16px'
                    }}>
                      {item.image}
                    </div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ color: '#b3b3b3', fontSize: '14px', textTransform: 'capitalize' }}>{item.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'search' || activeTab === 'library') && (
            <div>
              <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
                {activeTab === 'search' ? 'Search Results' : 'Your Music'}
              </h2>
              <div style={{
                backgroundColor: '#181818',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 200px 100px 40px',
                  gap: '16px',
                  padding: '8px 0',
                  borderBottom: '1px solid #282828',
                  color: '#b3b3b3',
                  fontSize: '14px',
                  marginBottom: '16px'
                }}>
                  <div>#</div>
                  <div>TITLE</div>
                  <div>ALBUM</div>
                  <div>DURATION</div>
                  <div></div>
                </div>
                {(activeTab === 'search' ? filteredSongs : songs).map((song, index) => (
                  <div
                    key={song.id}
                    onClick={() => playSong(song)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 200px 100px 40px',
                      gap: '16px',
                      padding: '8px 0',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                      backgroundColor: currentSong?.id === song.id ? '#282828' : 'transparent'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#282828'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = currentSong?.id === song.id ? '#282828' : 'transparent'}
                  >
                    <div style={{ color: '#b3b3b3' }}>{index + 1}</div>
                    <div>
                      <div style={{ fontWeight: currentSong?.id === song.id ? 'bold' : 'normal', color: currentSong?.id === song.id ? '#1db954' : '#fff' }}>
                        {song.title}
                      </div>
                      <div style={{ color: '#b3b3b3', fontSize: '14px' }}>{song.artist}</div>
                    </div>
                    <div style={{ color: '#b3b3b3' }}>{song.album}</div>
                    <div style={{ color: '#b3b3b3' }}>{song.duration}</div>
                    <div>
                      <Heart size={16} style={{ color: song.liked ? '#1db954' : '#b3b3b3', cursor: 'pointer' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Player */}
      {currentSong && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '90px',
          backgroundColor: '#181818',
          borderTop: '1px solid #282828',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '16px'
        }}>
          {/* Song Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '180px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#333',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🎵
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentSong.title}</div>
              <div style={{ color: '#b3b3b3', fontSize: '12px' }}>{currentSong.artist}</div>
            </div>
            <Heart size={16} style={{ color: currentSong.liked ? '#1db954' : '#b3b3b3', cursor: 'pointer' }} />
          </div>

          {/* Controls */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <Shuffle size={16} style={{ color: '#b3b3b3', cursor: 'pointer' }} />
              <SkipBack size={16} style={{ color: '#b3b3b3', cursor: 'pointer' }} />
              <div
                onClick={togglePlayPause}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isPlaying ? <Pause size={14} style={{ color: '#000' }} /> : <Play size={14} style={{ color: '#000' }} />}
              </div>
              <SkipForward size={16} style={{ color: '#b3b3b3', cursor: 'pointer' }} />
              <Repeat size={16} style={{ color: '#b3b3b3', cursor: 'pointer' }} />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              maxWidth: '500px'
            }}>
              <span style={{ fontSize: '12px', color: '#b3b3b3', minWidth: '40px' }}>
                {formatTime(currentTime)}
              </span>
              <div style={{
                flex: 1,
                height: '4px',
                backgroundColor: '#4f4f4f',
                borderRadius: '2px',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: '#1db954',
                  borderRadius: '2px'
                }} />
              </div>
              <span style={{ fontSize: '12px', color: '#b3b3b3', minWidth: '40px' }}>
                {currentSong.duration}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '120px'
          }}>
            <Volume2 size={16} style={{ color: '#b3b3b3' }} />
            <div style={{
              width: '80px',
              height: '4px',
              backgroundColor: '#4f4f4f',
              borderRadius: '2px',
              cursor: 'pointer'
            }}>
              <div style={{
                width: `${volume * 100}%`,
                height: '100%',
                backgroundColor: '#1db954',
                borderRadius: '2px'
              }} />
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} />
    </div>
  );
};

export default SpotifyClone;