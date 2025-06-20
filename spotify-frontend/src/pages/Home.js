import React, { useState } from 'react';
import './Home.css';
import { SkipBack, Play, SkipForward, X } from 'lucide-react';

const trendingSong = {
  title: 'In My Heart',
  artist: 'Camila Cabello',
  plays: '70Million Plays',
  image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=facearea&w=600&q=80',
};

const topArtists = [
  { name: 'Scott', image: 'https://randomuser.me/api/portraits/men/32.jpg', plays: '640K Plays',
    bio: 'Scott is a multi-genre artist known for his energetic performances and chart-topping hits.',
    topSongs: [
      { title: 'Red Effect', duration: '3:12' },
      { title: 'Night Drive', duration: '2:58' },
      { title: 'Skyline', duration: '3:45' }
    ]
  },
  { name: 'Billie', image: 'https://randomuser.me/api/portraits/women/44.jpg', plays: '550K Plays',
    bio: 'Billie is a pop sensation with a unique voice and a string of global hits.',
    topSongs: [
      { title: 'Ocean Eyes', duration: '2:58' },
      { title: 'Lovely', duration: '3:20' },
      { title: 'Bad Guy', duration: '3:14' }
    ]
  },
  { name: 'Thie', image: 'https://randomuser.me/api/portraits/men/45.jpg', plays: '320K Plays',
    bio: 'Thie blends indie and electronic sounds for a fresh, modern vibe.',
    topSongs: [
      { title: 'Indie Vibes', duration: '3:45' },
      { title: 'Lost in Sound', duration: '4:01' },
      { title: 'Echoes', duration: '2:50' }
    ]
  },
  { name: 'Karrya', image: 'https://randomuser.me/api/portraits/women/65.jpg', plays: '290K Plays',
    bio: 'Karrya is a rising star in the pop world, known for her catchy hooks.',
    topSongs: [
      { title: 'Pop Queen', duration: '4:01' },
      { title: 'Shine', duration: '3:33' },
      { title: 'Dreamer', duration: '3:10' }
    ]
  },
  { name: 'Minaj', image: 'https://randomuser.me/api/portraits/women/66.jpg', plays: '99K Plays',
    bio: 'Minaj is a versatile artist with a powerful stage presence.',
    topSongs: [
      { title: 'Rap Star', duration: '2:59' },
      { title: 'Anthem', duration: '3:21' },
      { title: 'Glow', duration: '3:05' }
    ]
  }
];

const genres = [
  { name: 'Dance Beat' },
  { name: 'Electro Pop' },
  { name: 'Alternative Indie' },
  { name: 'Hip Hop' },
  { name: 'Classical Period' },
  { name: 'Hip Hop Rap' }
];

const topCharts = [
  { title: 'Red Effect', artist: 'Scott Land', duration: '3:12', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { title: 'Ocean Eyes', artist: 'Billie', duration: '2:58', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { title: 'Indie Vibes', artist: 'Thie', duration: '3:45', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { title: 'Pop Queen', artist: 'Karrya', duration: '4:01', image: 'https://randomuser.me/api/portraits/women/65.jpg' },
];

const playerCard = {
  title: 'Red Effect',
  artist: 'Scott Land',
  image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=facearea&w=600&q=80',
};

const Home = () => {
  const [selectedArtist, setSelectedArtist] = useState(null);

  const closeArtistModal = (e) => {
    console.log('closeArtistModal called, target:', e.target.className);
    if (
      e.target.classList.contains('artist-modal-overlay') ||
      e.target.classList.contains('artist-modal-close')
    ) {
      setSelectedArtist(null);
    }
  };

  return (
    <div className="home-root">
      {/* Artist Info Modal */}
      {selectedArtist && (
        <div className="artist-modal-overlay" onClick={closeArtistModal}>
          <div className="artist-modal-card">
            <button className="artist-modal-close" onClick={e => { console.log('close button clicked'); e.stopPropagation(); closeArtistModal(e); }}><X size={22} /></button>
            <img src={selectedArtist.image} alt={selectedArtist.name} className="artist-modal-img" />
            <div className="artist-modal-name">{selectedArtist.name}</div>
            <div className="artist-modal-plays">{selectedArtist.plays}</div>
            <div className="artist-modal-bio">{selectedArtist.bio}</div>
            <div className="artist-modal-top-songs-title">Top Songs</div>
            <ul className="artist-modal-top-songs-list">
              {selectedArtist.topSongs.map((song, idx) => (
                <li key={song.title} className="artist-modal-top-song">
                  <span className="artist-modal-top-song-index">{idx + 1}.</span>
                  <span className="artist-modal-top-song-title">{song.title}</span>
                  <span className="artist-modal-top-song-duration">{song.duration}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="home-hero">
        <div className="home-hero-text">
          <div className="home-hero-label">Trending New Hits</div>
          <div className="home-hero-title">{trendingSong.title}</div>
          <div className="home-hero-artist">{trendingSong.artist} <span className="home-hero-plays">{trendingSong.plays}</span></div>
          <button className="home-hero-btn">Listen Now</button>
        </div>
        <img className="home-hero-img" src={trendingSong.image} alt="Trending Song" />
      </div>

      {/* Cards Grid */}
      <div className="home-cards-grid">
        {/* Top Artists Card */}
        <div className="home-card home-card-artists">
          <div className="home-card-title">Top Artists</div>
          <div className="home-card-artists-list">
            {topArtists.map((artist) => (
              <div className="home-artist-card" key={artist.name} onClick={() => setSelectedArtist(artist)}>
                <img src={artist.image} alt={artist.name} className="home-artist-img" />
                <div className="home-artist-name">{artist.name}</div>
                <div className="home-artist-plays">{artist.plays}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Genres Card */}
        <div className="home-card home-card-genres">
          <div className="home-card-title">Genres</div>
          <div className="home-card-genres-list">
            {genres.map((genre) => (
              <div
                className="home-genre-card"
                key={genre.name}
              >
                <span className="home-genre-text">{genre.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Top Charts Card */}
        <div className="home-card home-card-charts">
          <div className="home-card-title">Top Charts</div>
          <div className="home-card-charts-list">
            {topCharts.map((chart, i) => (
              <div className="home-chart-row" key={chart.title}>
                <div className="home-chart-index">{String(i + 1).padStart(2, '0')}</div>
                <img src={chart.image} alt={chart.title} className="home-chart-img" />
                <div className="home-chart-info">
                  <div className="home-chart-title">{chart.title}</div>
                  <div className="home-chart-artist">{chart.artist}</div>
                </div>
                <div className="home-chart-duration">{chart.duration}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Player Card */}
        <div className="home-card home-card-player">
          <div className="home-card-player-art">
            <img src={playerCard.image} alt={playerCard.title} />
          </div>
          <div className="home-card-player-title">{playerCard.title}</div>
          <div className="home-card-player-artist">{playerCard.artist}</div>
          <div className="home-card-player-controls">
            <button className="home-card-player-btn">
              <SkipBack size={22} color="#1db954" className="player-icon" />
            </button>
            <button className="home-card-player-btn">
              <Play size={22} color="#1db954" className="player-icon" />
            </button>
            <button className="home-card-player-btn">
              <SkipForward size={22} color="#1db954" className="player-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 