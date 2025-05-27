# Spotify Clone Backend

A RESTful API backend for a Spotify-like music streaming application built with Node.js and Express.

## Features

- **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Protected routes

- **Music Management**
  - Upload audio files
  - Search songs by title, artist, or album
  - Like/unlike songs
  - Play count tracking

- **Playlist Management**
  - Create, read, update, delete playlists
  - Add/remove songs from playlists
  - Public/private playlist settings

- **Discovery Features**
  - Trending songs
  - Recommendations by genre
  - Recently played tracks

- **File Upload**
  - Audio file upload with validation
  - Image upload for album covers
  - File size limits and type checking

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Songs
- `GET /api/songs` - Get all songs (with search, pagination)
- `GET /api/songs/:id` - Get specific song
- `POST /api/songs` - Upload new song (requires auth)
- `PUT /api/songs/:id/like` - Like/unlike song (requires auth)
- `PUT /api/songs/:id/play` - Increment play count
- `DELETE /api/songs/:id` - Delete song (requires auth)

### Playlists
- `GET /api/playlists` - Get user playlists (requires auth)
- `GET /api/playlists/:id` - Get specific playlist
- `POST /api/playlists` - Create playlist (requires auth)
- `PUT /api/playlists/:id` - Update playlist (requires auth)
- `POST /api/playlists/:id/songs` - Add song to playlist (requires auth)
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist (requires auth)
- `DELETE /api/playlists/:id` - Delete playlist (requires auth)

### Discovery
- `GET /api/recommendations` - Get recommended songs
- `GET /api/trending` - Get trending songs
- `GET /api/user/recent` - Get recently played (requires auth)

### User
- `GET /api/user/profile` - Get user profile (requires auth)

### Utility
- `GET /api/stats` - Get platform statistics
- `GET /api/health` - Health check

## File Upload

The API supports file uploads for:
- Audio files (songs): Accepts most audio formats
- Images (album covers): Accepts image formats (jpg, png, gif, etc.)

Files are stored in the `uploads/` directory with organized subdirectories.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- File type validation
- File size limits
- CORS configuration
- Request rate limiting (recommended for production)

## Production Deployment

1. Set environment variables properly
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Use a proper database (PostgreSQL, MongoDB)
5. Implement proper logging
6. Set up file storage service (AWS S3, Cloudinary)

## Database Migration

This demo uses in-memory storage. For production, replace with:
- PostgreSQL with Sequelize ORM
- MongoDB with Mongoose
- MySQL with Sequelize

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request