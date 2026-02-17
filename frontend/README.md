<div align="center">

# 🎬 AniTime

**Plan Your Anime Journey with Precision**

A beautiful, modern mobile app that helps anime fans calculate watch time and plan their viewing schedule efficiently.

[![Stars](https://img.shields.io/github/stars/yourusername/anitime?style=social)](https://github.com/yourusername/anitime/stargazers)
[![Forks](https://img.shields.io/github/forks/yourusername/anitime?style=social)](https://github.com/yourusername/anitime/network/members)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Contributing](#-contributing)

</div>

---

## 📖 About The Project

AniTime is a comprehensive anime watch time calculator that helps you plan your anime viewing schedule. Whether you want to finish a series before a deadline, manage your daily watch time, or simply know how long it will take to complete an anime, AniTime has you covered.

### ✨ Features

- 🔍 **Discover Anime** - Browse trending and popular anime with beautiful card layouts
- ⏱️ **Smart Calculator** - Multiple calculation modes:
  - Episodes per day
  - Minutes per day
  - Target completion date
- 📊 **Time Insights** - Instant total watch time for any anime
- 🎨 **Modern UI/UX** - Smooth animations, gradients, and responsive design
- 📱 **Mobile-First** - Optimized for both phones and tablets
- 🌙 **Dark Theme** - Easy on the eyes for late-night binge planning

## 🛠️ Tech Stack

### Frontend
- **React Native** with **Expo** - Cross-platform mobile development
- **Expo Router** - File-based navigation
- **React Query** - Efficient data fetching and caching
- **React Native Reanimated** - Smooth 60fps animations
- **TypeScript** - Type-safe development

### Backend
- **FastAPI** - High-performance Python web framework
- **PostgreSQL** - Robust relational database
- **Redis** - Fast caching layer
- **Alembic** - Database migrations
- **Jikan API** - Anime data from MyAnimeList

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://www.python.org/))
- **PostgreSQL** ([Download](https://www.postgresql.org/download/))
- **Redis** ([Download](https://redis.io/download))
- **Expo Go** app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Installation

1. **Fork & Clone the repository**
   ```bash
   # Fork this repo on GitHub first, then clone your fork
   git clone https://github.com/YOUR_USERNAME/anitime.git
   cd anitime
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Create virtual environment (recommended)
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Run database migrations
   alembic upgrade head
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

#### **Backend Server**

From the `backend` directory:

```bash
# Option 1: Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Option 2: Using Python module
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Flags:**
- `--reload` - Auto-restart on code changes (dev mode)
- `--host 0.0.0.0` - Accessible from other devices on network
- `--port 8000` - Server port

#### **Frontend App**

From the `frontend` directory:

```bash
# Start Expo development server
npx expo start

# Or with cache clearing
npx expo start --clear
```

**Then:**
1. Scan the QR code with **Expo Go** app on your phone
2. Or press `w` to open in web browser
3. Or press `a` for Android emulator / `i` for iOS simulator

### 📱 Device Configuration

**For physical devices (Expo Go):**

Update `frontend/api/client.js` with your computer's local IP:

```javascript
const API_HOST = Platform.select({
    android: '192.168.1.XX',  // Replace with your computer's IP
    ios: '192.168.1.XX',      // Find it using: ipconfig (Windows) or ifconfig (Mac/Linux)
    web: 'localhost',
});
```

> **Tip:** Your computer and phone must be on the same WiFi network!

## 📁 Project Structure

```
anitime/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/           # API endpoints
│   │   ├── models/           # Database models
│   │   ├── services/         # Business logic
│   │   └── main.py           # FastAPI app entry
│   ├── alembic/              # Database migrations
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment template
│
├── frontend/
│   ├── app/
│   │   ├── (tabs)/           # Tab navigation screens
│   │   ├── details.tsx       # Anime details screen
│   │   └── search.tsx        # Search screen
│   ├── components/           # Reusable UI components
│   ├── api/                  # API client
│   ├── constants/            # Theme & constants
│   └── package.json          # Node dependencies
│
└── README.md
```

## 🤝 Contributing

We love contributions! Here's how you can help make AniTime even better:

### How to Contribute

1. **⭐ Star this repository** - Show your support!
2. **🍴 Fork the repository** - Create your own copy
3. **🌿 Create a branch** - `git checkout -b feature/amazing-feature`
4. **💻 Make your changes** - Write clean, documented code
5. **✅ Test thoroughly** - Ensure everything works
6. **📝 Commit your changes** - `git commit -m 'Add amazing feature'`
7. **🚀 Push to your fork** - `git push origin feature/amazing-feature`
8. **🎉 Open a Pull Request** - We'll review it ASAP!

### Contribution Ideas

- 🐛 Fix bugs or issues
- ✨ Add new features (watchlist, favorites, etc.)
- 🎨 Improve UI/UX design
- 📚 Enhance documentation
- 🧪 Add tests
- 🌍 Add internationalization

### Code Style

- Follow existing code patterns
- Use TypeScript for frontend
- Write meaningful commit messages
- Comment complex logic
- Keep functions small and focused

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) - For providing anime data
- [MyAnimeList](https://myanimelist.net/) - Source of anime information
- [Expo](https://expo.dev/) - Amazing React Native framework

---

<div align="center">

**Made with ❤️ by anime fans, for anime fans**

If you found this project helpful, please consider giving it a ⭐!

[Report Bug](https://github.com/yourusername/anitime/issues) • [Request Feature](https://github.com/yourusername/anitime/issues)

</div>
