import React from 'react';
import { Home, Search, Library, Plus } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, playlists }) => (
  <div className="sidebar">
    {/* Logo */}
    <div className="sidebar-logo">Spotify</div>
    {/* Navigation */}
    <div className="sidebar-nav">
      <div
        className={`sidebar-nav-item${activeTab === 'home' ? ' active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <Home size={24} />
        Home
      </div>
      <div
        className={`sidebar-nav-item${activeTab === 'search' ? ' active' : ''}`}
        onClick={() => setActiveTab('search')}
      >
        <Search size={24} />
        Search
      </div>
      <div
        className={`sidebar-nav-item${activeTab === 'library' ? ' active' : ''}`}
        onClick={() => setActiveTab('library')}
      >
        <Library size={24} />
        Your Library
      </div>
    </div>
    {/* Create Playlist */}
    <div className="sidebar-create-playlist">
      <Plus size={24} />
      Create Playlist
    </div>
    {/* Playlists */}
    <div className="sidebar-playlists">
      {playlists.map(playlist => (
        <div key={playlist.id} className="sidebar-playlist-item">
          {playlist.name}
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar; 