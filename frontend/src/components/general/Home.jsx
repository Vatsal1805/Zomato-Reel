import React, { useState, useRef, useEffect } from "react";
import './Home.css';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [loadedVideos, setLoadedVideos] = useState(new Set());
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    // Fetch uploaded videos from backend
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3000/api/food", { 
                    withCredentials: true 
                });
                
                // Transform the data to match our component's expected format
                const transformedVideos = response.data.foodItems.map(item => ({
                    id: item._id,
                    _id: item._id,
                    videoUrl: item.videoUrl,
                    description: item.description || "Delicious food item",
                    storeName: item.foodPartner?.restaurantName || item.foodPartner?.ownerName || "Food Partner",
                    storeId: item.foodPartner?._id,
                    name: item.name,
                    thumbnail: item.videoUrl // Use video URL as thumbnail for now
                }));
                
                setVideos(transformedVideos);
                setError(null);
            } catch (error) {
                console.error("Error fetching food items:", error);
                
                // Check if it's an authentication error
                if (error.response?.status === 401) {
                    // User is not authenticated, redirect to role selection
                    alert("Please login to view food videos!");
                    navigate("/");
                    return;
                }
                
                setError("Failed to load videos. Please try again later.");
                setVideos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [navigate]);

  



    const handleScroll = (e) => {
        const container = containerRef.current;
        if (!container || videos.length === 0) return;
        
        const scrollTop = container.scrollTop;
        const videoHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / videoHeight);
        
        if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
            console.log(`Switching to video ${newIndex}: ${videos[newIndex]?.name}`);
            setCurrentVideoIndex(newIndex);
        }
    };

    const handleVisitStore = (storeId, storeName) => {
        if (!storeId) {
            alert("Store information not available");
            return;
        }
        
        // Navigate to food partner profile page
        console.log(`Visiting store: ${storeName} (ID: ${storeId})`);
        navigate(`/partner/${storeId}`);
    };

    const handleVideoLoad = (videoId) => {
        setLoadedVideos(prev => new Set([...prev, videoId]));
    };

    const truncateText = (text, maxLines = 2) => {
        // This is a simple truncation - you might want to use a more sophisticated method
        const words = text.split(' ');
        const maxWords = maxLines * 8; // Approximate words per line
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return text;
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [currentVideoIndex, videos.length]);

    // Handle initial video play when videos are loaded
    useEffect(() => {
        if (videos.length > 0 && currentVideoIndex === 0) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                const firstVideo = document.querySelector('.video-player');
                if (firstVideo) {
                    firstVideo.play().catch(e => console.log('Initial play prevented:', e));
                }
            }, 500);
        }
    }, [videos.length]);

    // Auto-play video when it comes into view
    useEffect(() => {
        const videoElements = document.querySelectorAll('.video-player');
        console.log(`Managing ${videoElements.length} videos, current index: ${currentVideoIndex}`);
        
        videoElements.forEach((video, index) => {
            if (index === currentVideoIndex) {
                console.log(`Playing video ${index}: ${videos[index]?.name}`);
                // Reset video to beginning and play
                video.currentTime = 0;
                video.load(); // Force reload the video
                video.play().catch(e => {
                    console.log(`Auto-play prevented for video ${index}:`, e);
                    // Try to play again after a short delay
                    setTimeout(() => {
                        video.play().catch(err => console.log('Retry play failed:', err));
                    }, 1000);
                });
            } else {
                video.pause();
            }
        });
    }, [currentVideoIndex, videos]);

    // Loading state
    if (loading) {
        return (
            <div className="home-container">
                <div className="video-container">
                    <div className="video-placeholder">
                        <div className="loading-spinner"></div>
                        <p>Loading delicious content...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="home-container">
                <div className="video-container">
                    <div className="video-placeholder">
                        <div style={{ textAlign: 'center', color: 'white', padding: '20px' }}>
                            <h3>😔 Something went wrong!</h3>
                            <p>{error}</p>
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button 
                                    className="visit-store-btn" 
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </button>
                                <Link 
                                    to="/" 
                                    className="visit-store-btn"
                                    style={{ textDecoration: 'none', background: 'rgba(255, 255, 255, 0.2)' }}
                                >
                                    Go to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (!videos || videos.length === 0) {
        return (
            <div className="home-container">
                <div className="video-container">
                    <div className="video-placeholder">
                        <div style={{ textAlign: 'center', color: 'white', padding: '20px' }}>
                            <h3>🍽️ No Food Videos Yet</h3>
                            <p>Food partners haven't uploaded videos yet. Check back soon for delicious content!</p>
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button 
                                    className="visit-store-btn" 
                                    onClick={() => window.location.reload()}
                                >
                                    Refresh
                                </button>
                                <Link to="/" className="visit-store-btn" style={{ 
                                    textDecoration: 'none', 
                                    background: 'rgba(255, 255, 255, 0.2)' 
                                }}>
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container" ref={containerRef}>
            {/* Scroll progress indicator */}
            <div className="scroll-indicator">
                {videos.map((_, index) => (
                    <div 
                        key={index}
                        className={`scroll-dot ${index === currentVideoIndex ? 'active' : ''}`}
                    />
                ))}
            </div>

            {videos.map((video, index) => (
                <div key={video._id} className={`video-container ${loadedVideos.has(video._id) ? 'loaded' : ''}`}>
                    <video
                        className="video-player"
                        src={video.videoUrl}
                        poster={video.thumbnail}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onError={(e) => {
                            // Fallback for video loading errors
                            console.error(`Video loading error for ${video.name} (${video.videoUrl}):`, e);
                            console.log('Video element:', e.target);
                            // Don't hide the video, let the fallback image show
                        }}
                        onLoadStart={() => {
                            // Video started loading
                            console.log(`Video loading started: ${video.name}`);
                        }}
                        onCanPlay={(e) => {
                            // Video can start playing
                            console.log(`Video can play: ${video.name}`);
                            handleVideoLoad(video._id);
                            
                            // If this is the current video, play it
                            if (index === currentVideoIndex) {
                                e.target.play().catch(err => console.log('Play prevented:', err));
                            }
                        }}
                        onLoadedData={() => {
                            console.log(`Video loaded: ${video.name}`);
                        }}
                    />
                    
                    {/* Fallback image if video fails to load */}
                    <div 
                        className="video-fallback"
                        style={{
                            backgroundImage: `url(${video.thumbnail})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 0
                        }}
                    ></div>
                    
                    {/* Video overlay with description and button */}
                    <div className="video-overlay">
                        <div className="video-content">
                            <div className="video-description">
                                <h4 style={{ 
                                    color: 'white', 
                                    margin: '0 0 8px 0', 
                                    fontSize: '16px', 
                                    fontWeight: '600' 
                                }}>
                                    {video.name}
                                </h4>
                                <p>{truncateText(video.description || `Delicious ${video.name} from ${video.storeName}`)}</p>
                            </div>
                            <button 
                                className="visit-store-btn"
                                onClick={() => handleVisitStore(video.storeId, video.storeName)}
                            >
                                Visit Store
                            </button>
                        </div>
                    </div>

                    {/* Video loading placeholder */}
                    <div className="video-placeholder">
                        <div className="loading-spinner"></div>
                        <p>Loading delicious content...</p>
                    </div>
                </div>
            ))}
            
            {/* Floating Action Button for Food Partners */}
            <Link to="/create-food-partner" className="fab-add-food" title="Add New Food Item">
                <span className="fab-icon">+</span>
                <span className="fab-text">Add Food</span>
            </Link>
        </div>
    );
};

export default Home;