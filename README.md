# 🍽️ Zomato Reel - TikTok Style Food Video Platform

A modern, mobile-first social media platform for food enthusiasts, built with React and Node.js. Share, discover, and interact with delicious food videos in a TikTok-style vertical feed.

![Zomato Reel Banner](https://img.shields.io/badge/Zomato-Reel-orange?style=for-the-badge&logo=food&logoColor=white)

## 🌟 Features

### 📱 **TikTok-Style Video Feed**
- **Vertical Video Scrolling**: Smooth infinite scroll through food videos
- **Auto-Play Videos**: Automatic video playback when in view
- **Mobile-First Design**: Optimized for mobile devices with touch interactions
- **Glass-Morphism UI**: Modern translucent design with blur effects

### 👥 **Dual User System**
- **Food Partners**: Restaurant owners and food creators
  - Upload food videos with descriptions
  - Manage restaurant profiles
  - Track engagement metrics
- **Regular Users**: Food enthusiasts and consumers
  - Browse and discover food content
  - Interact with videos (like, save, comment)
  - Build personal saved collections

### 🎬 **Video Interactions**
- **❤️ Like System**: Double-tap to like videos with real-time count updates
- **🔖 Save Videos**: Bookmark favorite videos to personal collection
- **💬 Comments**: Professional comment modal with smooth animations
- **➕ Add Content**: Quick access button for food partners to upload

### 📊 **Engagement Features**
- **Real-Time Counts**: Live updates for likes, saves, and comments
- **Persistent Data**: Counts maintained across page refreshes
- **User Preferences**: Remember liked and saved videos
- **Social Interactions**: View and add comments on videos

### 🏪 **Restaurant Integration**
- **Store Profiles**: Dedicated pages for food partners
- **Visit Store Button**: Direct link to restaurant profiles
- **Restaurant Info**: Display restaurant name and owner details
- **Content Attribution**: Clear labeling of content creators

### 📱 **Mobile Optimizations**
- **Responsive Design**: Adapts to all screen sizes (desktop, tablet, mobile)
- **Touch-Friendly**: Proper touch targets and gestures
- **Bottom Navigation**: Easy thumb navigation between sections
- **Mobile Comment Modal**: Bottom sheet style for better UX

### 🎨 **Modern UI/UX**
- **Dark Theme**: Elegant dark mode with orange accent colors
- **Smooth Animations**: Micro-interactions and hover effects
- **Loading States**: Professional loading spinners and placeholders
- **Error Handling**: User-friendly error messages and retry options

### 🔐 **Authentication System**
- **JWT-Based Auth**: Secure token-based authentication
- **Role-Based Access**: Different permissions for users and food partners
- **Protected Routes**: Secure access to user-specific features
- **Session Management**: Persistent login sessions

## 🛠️ Tech Stack

### **Frontend**
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **CSS3**: Custom styling with animations and responsive design
- **Vite**: Fast build tool and development server

### **Backend**
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM for MongoDB with schema validation
- **JWT**: JSON Web Tokens for authentication
- **Multer**: File upload handling for videos
- **ImageKit**: Cloud storage and video delivery

### **Database Models**
- **Users**: User authentication and preferences
- **Food Partners**: Restaurant and creator profiles
- **Food Items**: Video content with metadata
- **Likes**: User engagement tracking
- **Saves**: Personal video collections
- **Comments**: Nested comment system with replies

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vatsal1805/Zomato-Reel.git
   cd Zomato-Reel
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   Create `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

5. **Start the Development Servers**
   
   **Backend:**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:3000
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   # Client runs on http://localhost:5173
   ```

## 📁 Project Structure

```
Zomato-Reel/
├── backend/
│   ├── src/
│   │   ├── controllers/         # API route handlers
│   │   │   ├── auth.controllers.js
│   │   │   └── food.controllers.js
│   │   ├── models/             # Database models
│   │   │   ├── user.model.js
│   │   │   ├── foodPartner.model.js
│   │   │   ├── fooditem.model.js
│   │   │   ├── like.model.js
│   │   │   ├── save.model.js
│   │   │   └── comment.model.js
│   │   ├── routes/             # API routes
│   │   │   ├── auth.route.js
│   │   │   └── food.route.js
│   │   ├── middlewares/        # Custom middleware
│   │   │   └── auth.middlewares.js
│   │   ├── services/           # External services
│   │   │   └── storage.service.js
│   │   └── DB/                 # Database configuration
│   │       └── db.js
│   ├── server.js               # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Authentication components
│   │   │   │   ├── UserLogin.jsx
│   │   │   │   ├── UserRegister.jsx
│   │   │   │   ├── FoodPartnerLogin.jsx
│   │   │   │   └── FoodPartnerRegister.jsx
│   │   │   ├── general/        # Main app components
│   │   │   │   ├── Home.jsx
│   │   │   │   └── Saved.jsx
│   │   │   └── food-partner/   # Food partner features
│   │   │       ├── Profile.jsx
│   │   │       └── createFood.jsx
│   │   ├── routes/             # React Router setup
│   │   │   └── AppRoutes.jsx
│   │   ├── styles/             # Global styles
│   │   │   ├── auth.css
│   │   │   └── theme.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🎯 API Endpoints

### **Authentication**
- `POST /api/auth/user/register` - Register new user
- `POST /api/auth/user/login` - User login
- `POST /api/auth/food-partner/register` - Register food partner
- `POST /api/auth/food-partner/login` - Food partner login

### **Food Items**
- `GET /api/food` - Get all food videos
- `POST /api/food` - Upload new food video (Food Partner only)
- `POST /api/food/like` - Like/unlike a video
- `POST /api/food/save` - Save/unsave a video
- `GET /api/food/liked` - Get user's liked videos
- `GET /api/food/saved` - Get user's saved videos

### **Comments**
- `POST /api/food/comments` - Add comment to video
- `GET /api/food/comments/:foodId` - Get comments for video
- `PUT /api/food/comments/:commentId` - Update comment
- `DELETE /api/food/comments/:commentId` - Delete comment
- `GET /api/food/comments/:commentId/replies` - Get comment replies

## 🎨 Design System

### **Color Palette**
- **Primary Orange**: `#ff6b35` to `#ff7849` (gradient)
- **Dark Background**: `#1a1a1a` to `#2d2d2d`
- **Glass Elements**: `rgba(255, 255, 255, 0.05)` with blur
- **Text Colors**: White with various opacity levels

### **Typography**
- **Primary Font**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`
- **Heading Weights**: 600-700 for titles
- **Body Text**: 400-500 for content

### **Components**
- **Buttons**: Rounded corners with hover animations
- **Cards**: Glass-morphism with subtle borders
- **Modals**: Backdrop blur with slide animations
- **Icons**: Emoji-based for universal appeal

## 📱 Mobile Features

### **Responsive Breakpoints**
- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

### **Touch Interactions**
- **Swipe Navigation**: Vertical scrolling for videos
- **Tap Interactions**: Single tap for like, double tap for love
- **Bottom Sheet**: Mobile-optimized modals
- **Thumb-Friendly**: All buttons sized for easy thumb access

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing
- **Error Handling**: Secure error messages without sensitive data
- **File Upload Security**: Validated file types and sizes

## 🚀 Performance Optimizations

- **Lazy Loading**: Videos load as needed
- **Image Optimization**: Compressed thumbnails and assets
- **Efficient State Management**: Optimized React state updates
- **Database Indexing**: Optimized MongoDB queries
- **Caching**: Browser and server-side caching strategies

## 🔄 Future Enhancements

- [ ] **Video Filters**: Add filters and effects to videos
- [ ] **Live Streaming**: Real-time video broadcasting
- [ ] **Recipe Integration**: Link videos to detailed recipes
- [ ] **Social Sharing**: Share videos to other platforms
- [ ] **Analytics Dashboard**: Detailed engagement metrics
- [ ] **Push Notifications**: Real-time engagement alerts
- [ ] **Advanced Search**: Filter by cuisine, location, etc.
- [ ] **Video Editing**: In-app video editing tools

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Vatsal Bhavsar
- **GitHub**: [@Vatsal1805](https://github.com/Vatsal1805)

## 📞 Support

If you have any questions or need help getting started, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

<div align="center">
  <strong>Built with ❤️ for food lovers everywhere</strong>
  <br>
  <sub>Zomato Reel - Where Food Content Comes Alive</sub>
</div>