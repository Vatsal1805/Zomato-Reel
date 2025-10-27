import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Saved.css";

const Saved = () => {
    const [savedVideos, setSavedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [thumbnails, setThumbnails] = useState({});
    const [thumbnailsLoading, setThumbnailsLoading] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSavedVideos = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3000/api/food/saved", {
                    withCredentials: true
                });
                
                console.log("Saved videos response:", response.data);
                setSavedVideos(response.data.savedItems || []);
                setError("");
            } catch (error) {
                console.error("Error fetching saved videos:", error);
                
                if (error.response?.status === 401) {
                    alert("Please login to view saved videos!");
                    navigate("/");
                    return;
                }
                
                setError("Failed to load saved videos. Please try again later.");
                setSavedVideos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedVideos();
    }, [navigate]);

    const handleUnsaveVideo = async (videoId) => {
        try {
            await axios.post("http://localhost:3000/api/food/save", {
                id: videoId
            }, {
                withCredentials: true
            });
            
            // Remove from local state
            setSavedVideos(prev => prev.filter(video => video._id !== videoId));
        } catch (error) {
            console.error("Error unsaving video:", error);
            alert("Failed to unsave video. Please try again.");
        }
    };

    const handleVideoClick = (videoId) => {
        // Navigate to home and play specific video
        navigate(`/home?video=${videoId}`);
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const generateThumbnail = (videoElement, callback) => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set reasonable dimensions
            const width = Math.min(videoElement.videoWidth || 320, 480);
            const height = Math.min(videoElement.videoHeight || 180, 270);
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw current frame to canvas
            ctx.drawImage(videoElement, 0, 0, width, height);
            
            // Convert to data URL with lower quality for faster loading
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.6);
            callback(thumbnailUrl);
        } catch (error) {
            console.error('Thumbnail generation failed:', error);
            // Fallback: use a placeholder or the video element itself
            callback(null);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="saved-container">
                <div className="saved-header">
                    <h1>Saved Videos</h1>
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your saved videos...</p>
                </div>
                
                {/* Bottom Navigation */}
                <div className="bottom-nav">
                    <Link to="/home" className="nav-item">
                        <span className="nav-icon">🏠</span>
                        <span className="nav-label">Home</span>
                    </Link>
                    <Link to="/saved" className="nav-item active">
                        <span className="nav-icon">🔖</span>
                        <span className="nav-label">Saved</span>
                    </Link>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="saved-container">
                <div className="saved-header">
                    <h1>Saved Videos</h1>
                </div>
                <div className="error-container">
                    <h2>😔 Oops!</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-btn">
                        Try Again
                    </button>
                </div>
                
                {/* Bottom Navigation */}
                <div className="bottom-nav">
                    <Link to="/home" className="nav-item">
                        <span className="nav-icon">🏠</span>
                        <span className="nav-label">Home</span>
                    </Link>
                    <Link to="/saved" className="nav-item active">
                        <span className="nav-icon">🔖</span>
                        <span className="nav-label">Saved</span>
                    </Link>
                </div>
            </div>
        );
    }

    // Empty state
    if (!savedVideos || savedVideos.length === 0) {
        return (
            <div className="saved-container">
                <div className="saved-header">
                    <h1>Saved Videos</h1>
                    <p className="saved-count">0 saved videos</p>
                </div>
                <div className="empty-container">
                    <div className="empty-icon">🔖</div>
                    <h2>No Saved Videos Yet</h2>
                    <p>Save your favorite food videos to watch them later!</p>
                    <Link to="/home" className="browse-btn">
                        Browse Videos
                    </Link>
                </div>
                
                {/* Bottom Navigation */}
                <div className="bottom-nav">
                    <Link to="/home" className="nav-item">
                        <span className="nav-icon">🏠</span>
                        <span className="nav-label">Home</span>
                    </Link>
                    <Link to="/saved" className="nav-item active">
                        <span className="nav-icon">🔖</span>
                        <span className="nav-label">Saved</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="saved-container">
            <div className="saved-header">
                <h1>Saved Videos</h1>
                <p className="saved-count">{savedVideos.length} saved videos</p>
            </div>
            
            <div className="saved-grid">
                {savedVideos.map((video) => (
                    <div key={video._id} className="saved-video-card">
                        <div className="video-thumbnail" onClick={() => handleVideoClick(video._id)}>
                            <video
                                src={video.videoUrl}
                                muted
                                preload="metadata"
                                className="thumbnail-video"
                                onLoadedMetadata={(e) => {
                                    // Simple approach: just show the video as thumbnail
                                    e.target.currentTime = 0.5; // Seek to 0.5 seconds
                                }}
                                onError={(e) => {
                                    console.error('Video loading error:', e);
                                    // Show fallback
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div 
                                className="thumbnail-fallback"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #ff6b35, #ff7849)',
                                    display: 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                }}
                            >
                                <span style={{ 
                                    fontSize: '2rem', 
                                    color: 'white',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                }}>🍽️</span>
                            </div>
                            <div className="play-overlay">
                                <span className="play-icon">▶️</span>
                            </div>
                        </div>
                        
                        <div className="video-info">
                            <h3 className="video-title">{video.name}</h3>
                            <p className="video-description">
                                {truncateText(video.description)}
                            </p>
                            <div className="video-meta">
                                <span className="partner-name">
                                    {video.foodPartner?.restaurantName || video.foodPartner?.ownerName || "Food Partner"}
                                </span>
                                <div className="video-stats">
                                    <span className="stat">❤️ {video.likeCount || 0}</span>
                                    <span className="stat">💬 {video.commentCount || 0}</span>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            className="unsave-btn"
                            onClick={() => handleUnsaveVideo(video._id)}
                            title="Remove from saved"
                        >
                            <span className="unsave-icon">🗑️</span>
                        </button>
                    </div>
                ))}
            </div>
            
            {/* Bottom Navigation */}
            <div className="bottom-nav">
                <Link to="/home" className="nav-item">
                    <span className="nav-icon">🏠</span>
                    <span className="nav-label">Home</span>
                </Link>
                <Link to="/saved" className="nav-item active">
                    <span className="nav-icon">🔖</span>
                    <span className="nav-label">Saved</span>
                </Link>
            </div>
        </div>
    );
};

export default Saved;