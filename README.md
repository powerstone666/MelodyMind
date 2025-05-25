# MelodyMind 🎶

**A Modern Progressive Web App for AI-Powered Music Discovery & Offline Listening**

MelodyMind is a sophisticated, full-stack Progressive Web App (PWA) that combines artificial intelligence, emotion detection, and comprehensive offline capabilities to deliver a personalized music experience. Built with modern web technologies, it offers seamless music discovery, intelligent recommendations, and unrestricted offline access.

## 🌟 Key Features

### 🎧 **AI-Powered Music Discovery**
- **Intelligent Recommendation Engine**: Advanced algorithms powered by Spotify, JioSaavn, and Last.fm APIs
- **Multi-Source Integration**: Aggregates music from multiple platforms for comprehensive discovery
- **Smart String Matching**: Sophisticated algorithms for accurate song matching and recommendations

### 😊 **Emotion-Aware Music**
- **Real-Time Mood Detection**: Uses face-api.js for emotion recognition through camera
- **Mood-Based Recommendations**: Automatically suggests songs that match your current emotional state
- **Adaptive Playlists**: Dynamic playlist generation based on detected emotions

### 📱 **Progressive Web App Features**
- **Offline-First Architecture**: Full functionality without internet connection
- **Service Worker Integration**: Background sync and caching for optimal performance
- **Responsive Design**: Seamless experience across all devices and screen sizes
- **Install as App**: Native app-like experience with PWA installation

### 🎵 **Comprehensive Audio Experience**
- **Advanced Audio Controls**: Play, pause, skip, shuffle, repeat, and volume control
- **Audio Visualization**: Real-time audio waveform and spectrum analysis
- **Crossfade & Transitions**: Smooth audio transitions between tracks
- **Playback Queue Management**: Dynamic queue with drag-and-drop reordering

### 💾 **Offline Library Management**
- **Authentication-Free Offline Access**: Save and play songs offline without mandatory login
- **Smart Caching**: Intelligent storage management with automatic cleanup
- **Offline Library**: Dedicated interface for managing cached songs
- **Network-Aware Features**: Automatic detection and adaptation to connectivity status

### 👤 **User Experience & Personalization**
- **Optional Authentication**: Enhanced features with Firebase authentication (optional for offline use)
- **Personal Libraries**: Liked songs, recently played, and custom playlists
- **User Activity Tracking**: Optional analytics for personalized recommendations
- **Cross-Device Sync**: Seamless experience across multiple devices (when authenticated)

## 🛠️ **Technology Stack**

### **Frontend**
- **React.js 18+**: Modern React with hooks and context
- **Progressive Web App**: Service workers, web app manifest, offline capabilities
- **CSS3 & Responsive Design**: Modern styling with mobile-first approach
- **Audio API Integration**: Web Audio API for advanced audio processing

### **Backend & Services**
- **Firebase**: Authentication, real-time database, and hosting
- **Firestore**: NoSQL database for user data and preferences
- **Service Workers**: Background processing and caching strategies

### **AI & APIs**
- **face-api.js**: Real-time facial emotion detection
- **Spotify Web API**: Music metadata and recommendations
- **JioSaavn API**: Indian music content and streaming
- **Last.fm API**: Music recommendations and user statistics
- **Gemini AI**: Advanced recommendation processing

### **PWA Technologies**
- **Service Worker**: Offline functionality and background sync
- **Web App Manifest**: Native app installation and appearance
- **Cache API**: Intelligent caching for songs and app resources
- **Background Sync**: Seamless data synchronization when online

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 16+ and npm
- Modern web browser with PWA support
- Camera access (optional, for mood detection)

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/powerstone666/MelodyMind.git
   cd MelodyMind
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   # Create .env file with your API keys
   cp .env.example .env
   # Add your Firebase, Spotify, JioSaavn, and Last.fm API keys
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

### **PWA Installation**
- Visit the app in a compatible browser
- Look for the "Install App" prompt or browser installation icon
- Install for native app-like experience with offline capabilities

## 🎯 **Usage Guide**

### **Basic Music Discovery**
1. **Search**: Use the search bar to find songs, artists, or albums
2. **Browse**: Explore recommendations and curated playlists
3. **Play**: Click any song to start playback with full audio controls

### **Offline Listening**
1. **Save Songs**: Click the offline/download button on any song
2. **Access Offline Library**: Navigate to "Offline Songs" section
3. **Play Offline**: Enjoy cached songs without internet connection
4. **Manage Storage**: Remove songs to free up space

### **Mood-Based Discovery**
1. **Enable Camera**: Allow camera access for mood detection
2. **Auto-Detection**: Let the app analyze your emotions
3. **Mood Playlists**: Receive songs tailored to your current mood

### **Authentication (Optional)**
- **Sign Up/Login**: Enhanced features with personal libraries
- **Sync Across Devices**: Access your data on multiple devices
- **Advanced Analytics**: Detailed listening history and insights

## 📂 **Project Structure**

```
MelodyMind/
├── public/
│   ├── sw.js                    # Service Worker for PWA
│   ├── manifest.json           # Web App Manifest
│   └── icons/                  # PWA icons
├── src/
│   ├── AudioPlayer/            # Audio playback components
│   │   └── innersongs.jsx     # Main player with offline functionality
│   ├── Library/               # Music library components
│   │   └── OfflineSongs.jsx   # Offline music management
│   ├── hooks/                 # Custom React hooks
│   │   └── useOfflineDetection.js # Network status monitoring
│   ├── utils/                 # Utility functions
│   │   └── serviceWorkerUtils.js # PWA and caching utilities
│   └── components/            # Reusable UI components
└── README.md
```

## 🔧 **Configuration**

### **API Keys Required**
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_id
REACT_APP_JIOSAAVN_API_KEY=your_jiosaavn_key
REACT_APP_LASTFM_API_KEY=your_lastfm_key
REACT_APP_GEMINI_API_KEY=your_gemini_key
```

### **PWA Configuration**
- **Service Worker**: Handles caching and offline functionality
- **Manifest**: Defines app appearance and behavior
- **Caching Strategy**: Smart caching for optimal performance

## 🌐 **Browser Support**

### **Fully Supported**
- Chrome 80+ (Desktop & Mobile)
- Firefox 75+ (Desktop & Mobile)
- Safari 13+ (Desktop & Mobile)
- Edge 80+

### **PWA Features**
- Service Worker support
- Web App Manifest
- Cache API
- Background Sync (where supported)

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Standards**
- ESLint configuration for code quality
- Prettier for code formatting
- Component-based architecture
- PWA best practices

## 📱 **PWA Features Showcase**

- ✅ **Offline Functionality**: Complete app works without internet
- ✅ **Installable**: Add to home screen on mobile/desktop
- ✅ **Responsive**: Adaptive design for all screen sizes
- ✅ **Fast Loading**: Service worker caching for instant loads
- ✅ **Background Sync**: Data sync when connection restored
- ✅ **Push Notifications**: Stay updated with new features (optional)

## 🔒 **Privacy & Security**

- **Optional Authentication**: Core features work without account creation
- **Local Storage**: Offline songs stored locally on your device
- **No Tracking**: Minimal data collection, user privacy respected
- **Secure APIs**: All external API calls secured and rate-limited

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Music APIs**: Spotify, JioSaavn, Last.fm for music data
- **AI/ML**: Google's Gemini AI for advanced recommendations
- **Computer Vision**: face-api.js for emotion detection
- **Community**: Open source contributors and music enthusiasts

---

**Made with ❤️ by the MelodyMind Team**

*Experience the future of music discovery with AI-powered recommendations and seamless offline listening.*
