// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
if (!fs.existsSync('uploads/songs')) {
    fs.mkdirSync('uploads/songs');
}
if (!fs.existsSync('uploads/images')) {
    fs.mkdirSync('uploads/images');
}

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'song') {
            cb(null, 'uploads/songs/');
        } else if (file.fieldname === 'image') {
            cb(null, 'uploads/images/');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'song') {
            if (file.mimetype.startsWith('audio/')) {
                cb(null, true);
            } else {
                cb(new Error('Only audio files are allowed!'), false);
            }
        } else if (file.fieldname === 'image') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed!'), false);
            }
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// In-memory database (replace with actual database in production)
const users = [];
const songs = [
    {
        id: 1,
        title: 'Sample Song 1',
        artist: 'Artist A',
        album: 'Album X',
        duration: '3:45',
        genre: 'Pop',
        filePath: null,
        imagePath: null,
        liked: false,
        plays: 1250,
        createdAt: new Date()
    },
    {
        id: 2,
        title: 'Another Track',
        artist: 'Artist B',
        album: 'Album Y',
        duration: '4:20',
        genre: 'Rock',
        filePath: null,
        imagePath: null,
        liked: false,
        plays: 890,
        createdAt: new Date()
    }
];

const playlists = [
    {
        id: 1,
        name: 'My Favorites',
        description: 'Songs I love',
        userId: 1,
        songs: [1, 2],
        isPublic: true,
        createdAt: new Date()
    }
];

let nextSongId = 3;
let nextPlaylistId = 2;
let nextUserId = 1;

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: nextUserId++,
            username,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        users.push(user);

        // Generate token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Song Routes
app.get('/api/songs', (req, res) => {
    const { search, genre, limit = 50, offset = 0 } = req.query;
    let filteredSongs = [...songs];

    // Search functionality
    if (search) {
        const searchLower = search.toLowerCase();
        filteredSongs = filteredSongs.filter(song =>
            song.title.toLowerCase().includes(searchLower) ||
            song.artist.toLowerCase().includes(searchLower) ||
            song.album.toLowerCase().includes(searchLower)
        );
    }

    // Genre filter
    if (genre) {
        filteredSongs = filteredSongs.filter(song => 
            song.genre.toLowerCase() === genre.toLowerCase()
        );
    }

    // Pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedSongs = filteredSongs.slice(startIndex, endIndex);

    res.json({
        songs: paginatedSongs,
        total: filteredSongs.length,
        hasMore: endIndex < filteredSongs.length
    });
});

app.get('/api/songs/:id', (req, res) => {
    const song = songs.find(s => s.id === parseInt(req.params.id));
    if (!song) {
        return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
});

app.post('/api/songs', authenticateToken, upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), (req, res) => {
    try {
        const { title, artist, album, genre, duration } = req.body;
        
        if (!title || !artist) {
            return res.status(400).json({ error: 'Title and artist are required' });
        }

        const song = {
            id: nextSongId++,
            title,
            artist,
            album: album || 'Unknown Album',
            duration: duration || '0:00',
            genre: genre || 'Unknown',
            filePath: req.files.song ? req.files.song[0].path : null,
            imagePath: req.files.image ? req.files.image[0].path : null,
            liked: false,
            plays: 0,
            createdAt: new Date()
        };

        songs.push(song);
        res.status(201).json({ message: 'Song uploaded successfully', song });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/songs/:id/like', authenticateToken, (req, res) => {
    const song = songs.find(s => s.id === parseInt(req.params.id));
    if (!song) {
        return res.status(404).json({ error: 'Song not found' });
    }

    song.liked = !song.liked;
    res.json({ message: `Song ${song.liked ? 'liked' : 'unliked'}`, song });
});

app.put('/api/songs/:id/play', (req, res) => {
    const song = songs.find(s => s.id === parseInt(req.params.id));
    if (!song) {
        return res.status(404).json({ error: 'Song not found' });
    }

    song.plays += 1;
    res.json({ message: 'Play count updated', song });
});

app.delete('/api/songs/:id', authenticateToken, (req, res) => {
    const songIndex = songs.findIndex(s => s.id === parseInt(req.params.id));
    if (songIndex === -1) {
        return res.status(404).json({ error: 'Song not found' });
    }

    const song = songs[songIndex];
    
    // Delete files if they exist
    if (song.filePath && fs.existsSync(song.filePath)) {
        fs.unlinkSync(song.filePath);
    }
    if (song.imagePath && fs.existsSync(song.imagePath)) {
        fs.unlinkSync(song.imagePath);
    }

    songs.splice(songIndex, 1);
    res.json({ message: 'Song deleted successfully' });
});

// Playlist Routes
app.get('/api/playlists', authenticateToken, (req, res) => {
    const userPlaylists = playlists.filter(p => p.userId === req.user.userId || p.isPublic);
    
    // Populate with song details
    const playlistsWithSongs = userPlaylists.map(playlist => ({
        ...playlist,
        songs: playlist.songs.map(songId => songs.find(s => s.id === songId)).filter(Boolean)
    }));

    res.json(playlistsWithSongs);
});

app.get('/api/playlists/:id', (req, res) => {
    const playlist = playlists.find(p => p.id === parseInt(req.params.id));
    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    // Populate with song details
    const playlistWithSongs = {
        ...playlist,
        songs: playlist.songs.map(songId => songs.find(s => s.id === songId)).filter(Boolean)
    };

    res.json(playlistWithSongs);
});

app.post('/api/playlists', authenticateToken, (req, res) => {
    const { name, description, isPublic = false } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Playlist name is required' });
    }

    const playlist = {
        id: nextPlaylistId++,
        name,
        description: description || '',
        userId: req.user.userId,
        songs: [],
        isPublic,
        createdAt: new Date()
    };

    playlists.push(playlist);
    res.status(201).json({ message: 'Playlist created successfully', playlist });
});

app.put('/api/playlists/:id', authenticateToken, (req, res) => {
    const playlist = playlists.find(p => p.id === parseInt(req.params.id));
    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized to edit this playlist' });
    }

    const { name, description, isPublic } = req.body;
    
    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic;

    res.json({ message: 'Playlist updated successfully', playlist });
});

app.post('/api/playlists/:id/songs', authenticateToken, (req, res) => {
    const playlist = playlists.find(p => p.id === parseInt(req.params.id));
    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized to modify this playlist' });
    }

    const { songId } = req.body;
    const song = songs.find(s => s.id === parseInt(songId));
    if (!song) {
        return res.status(404).json({ error: 'Song not found' });
    }

    if (playlist.songs.includes(parseInt(songId))) {
        return res.status(400).json({ error: 'Song already in playlist' });
    }

    playlist.songs.push(parseInt(songId));
    res.json({ message: 'Song added to playlist', playlist });
});

app.delete('/api/playlists/:id/songs/:songId', authenticateToken, (req, res) => {
    const playlist = playlists.find(p => p.id === parseInt(req.params.id));
    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized to modify this playlist' });
    }

    const songId = parseInt(req.params.songId);
    const songIndex = playlist.songs.indexOf(songId);
    
    if (songIndex === -1) {
        return res.status(404).json({ error: 'Song not in playlist' });
    }

    playlist.songs.splice(songIndex, 1);
    res.json({ message: 'Song removed from playlist', playlist });
});

app.delete('/api/playlists/:id', authenticateToken, (req, res) => {
    const playlistIndex = playlists.findIndex(p => p.id === parseInt(req.params.id));
    if (playlistIndex === -1) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    const playlist = playlists[playlistIndex];
    if (playlist.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized to delete this playlist' });
    }

    playlists.splice(playlistIndex, 1);
    res.json({ message: 'Playlist deleted successfully' });
});

// Recommendations and Discovery
app.get('/api/recommendations', (req, res) => {
    const { genre, limit = 10 } = req.query;
    
    let recommendedSongs = [...songs];
    
    if (genre) {
        recommendedSongs = recommendedSongs.filter(song => 
            song.genre.toLowerCase() === genre.toLowerCase()
        );
    }

    // Sort by plays (most popular first) and randomize
    recommendedSongs.sort((a, b) => b.plays - a.plays);
    recommendedSongs = recommendedSongs.slice(0, parseInt(limit) * 2);
    
    // Shuffle the results
    for (let i = recommendedSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [recommendedSongs[i], recommendedSongs[j]] = [recommendedSongs[j], recommendedSongs[i]];
    }

    res.json({
        songs: recommendedSongs.slice(0, parseInt(limit)),
        message: 'Recommendations based on popularity and genre'
    });
});

app.get('/api/trending', (req, res) => {
    const { limit = 20 } = req.query;
    
    // Sort by plays and recent creation date
    const trendingSongs = [...songs]
        .sort((a, b) => {
            const playsWeight = (b.plays - a.plays) * 0.7;
            const dateWeight = (new Date(b.createdAt) - new Date(a.createdAt)) * 0.3;
            return playsWeight + dateWeight;
        })
        .slice(0, parseInt(limit));

    res.json({
        songs: trendingSongs,
        message: 'Trending songs based on plays and recency'
    });
});

// User Profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const userPlaylists = playlists.filter(p => p.userId === user.id);
    const likedSongs = songs.filter(s => s.liked);

    res.json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        },
        stats: {
            playlistsCount: userPlaylists.length,
            likedSongsCount: likedSongs.length,
            totalPlays: songs.reduce((sum, song) => sum + song.plays, 0)
        },
        recentActivity: {
            playlists: userPlaylists.slice(0, 5),
            likedSongs: likedSongs.slice(0, 10)
        }
    });
});

// Recently Played
app.get('/api/user/recent', authenticateToken, (req, res) => {
    const { limit = 20 } = req.query;
    
    // In a real app, you'd track user's play history
    // For demo, return random songs
    const recentSongs = [...songs]
        .sort(() => 0.5 - Math.random())
        .slice(0, parseInt(limit));

    res.json({
        songs: recentSongs,
        message: 'Recently played songs'
    });
});

// Statistics
app.get('/api/stats', (req, res) => {
    const totalSongs = songs.length;
    const totalPlaylists = playlists.length;
    const totalUsers = users.length;
    const totalPlays = songs.reduce((sum, song) => sum + song.plays, 0);
    
    const genreStats = songs.reduce((acc, song) => {
        acc[song.genre] = (acc[song.genre] || 0) + 1;
        return acc;
    }, {});

    const topArtists = songs.reduce((acc, song) => {
        acc[song.artist] = (acc[song.artist] || 0) + song.plays;
        return acc;
    }, {});

    res.json({
        overview: {
            totalSongs,
            totalPlaylists,
            totalUsers,
            totalPlays
        },
        genres: genreStats,
        topArtists: Object.entries(topArtists)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([artist, plays]) => ({ artist, plays }))
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
        }
    }
    
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;