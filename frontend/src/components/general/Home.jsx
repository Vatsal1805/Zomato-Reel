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
    const [likedVideos, setLikedVideos] = useState(new Set());
    const [savedVideos, setSavedVideos] = useState(new Set());
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [currentVideoForComment, setCurrentVideoForComment] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
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
                    thumbnail: item.videoUrl, // Use video URL as thumbnail for now
                    likeCount: item.likeCount || 0,
                    commentCount: item.commentCount || 0,
                    isLiked: item.isLiked || false,
                    isSaved: item.isSaved || false
                }));
                
                setVideos(transformedVideos);
                setError(null);
                
                // Set liked and saved videos from the response
                const likedIds = new Set(transformedVideos.filter(video => video.isLiked).map(video => video._id));
                const savedIds = new Set(transformedVideos.filter(video => video.isSaved).map(video => video._id));
                setLikedVideos(likedIds);
                setSavedVideos(savedIds);
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

    const fetchUserPreferences = async () => {
        try {
            // Fetch liked videos
            const likedResponse = await axios.get("http://localhost:3000/api/food/liked", {
                withCredentials: true
            });
            if (likedResponse.data.likedItems) {
                const likedIds = new Set(likedResponse.data.likedItems.map(item => item._id));
                setLikedVideos(likedIds);
            }

            // Fetch saved videos
            const savedResponse = await axios.get("http://localhost:3000/api/food/saved", {
                withCredentials: true
            });
            if (savedResponse.data.savedItems) {
                const savedIds = new Set(savedResponse.data.savedItems.map(item => item._id));
                setSavedVideos(savedIds);
            }
        } catch (error) {
            console.error("Error fetching user preferences:", error);
            // Don't show error to user as this is non-critical
        }
    };

  



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

    const handleLikeVideo = async (videoId) => {
        try {
            const response = await axios.post("http://localhost:3000/api/food/like", {
                id: videoId
            }, {
                withCredentials: true
            });
            
            if (response.data.liked) {
                setLikedVideos(prev => new Set([...prev, videoId]));
            } else {
                setLikedVideos(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(videoId);
                    return newSet;
                });
            }
            
            // Update video likes count locally
            setVideos(prev => prev.map(video => 
                video._id === videoId 
                    ? { 
                        ...video, 
                        likeCount: response.data.liked 
                            ? (video.likeCount || 0) + 1 
                            : Math.max(0, (video.likeCount || 1) - 1)
                      }
                    : video
            ));
            
        } catch (error) {
            console.error("Error liking video:", error);
            if (error.response?.status === 401) {
                alert("Please login to like videos!");
                navigate("/");
            } else {
                alert("Failed to like video. Please try again.");
            }
        }
    };

    const handleSaveVideo = async (videoId) => {
        try {
            const response = await axios.post("http://localhost:3000/api/food/save", {
                id: videoId
            }, {
                withCredentials: true
            });
            
            if (response.data.saved) {
                setSavedVideos(prev => new Set([...prev, videoId]));
                alert("Video saved to your collection!");
            } else {
                setSavedVideos(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(videoId);
                    return newSet;
                });
                alert("Video removed from saved collection");
            }
            
        } catch (error) {
            console.error("Error saving video:", error);
            if (error.response?.status === 401) {
                alert("Please login to save videos!");
                navigate("/");
            } else {
                alert("Failed to save video. Please try again.");
            }
        }
    };

    const handleCommentVideo = async (videoId) => {
        const video = videos.find(v => v._id === videoId);
        setCurrentVideoForComment(video);
        setShowCommentModal(true);
        setCommentText("");
        setComments([]);
        
        // Fetch existing comments
        await fetchComments(videoId);
    };

    const fetchComments = async (videoId) => {
        try {
            setLoadingComments(true);
            const response = await axios.get(`http://localhost:3000/api/food/comments/${videoId}`, {
                withCredentials: true
            });
            
            setComments(response.data.comments || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleSubmitComment = async () => {
        if (commentText.trim() && currentVideoForComment) {
            const success = await addComment(currentVideoForComment._id, commentText.trim());
            if (success) {
                setCommentText("");
                // Refresh comments after adding new one
                await fetchComments(currentVideoForComment._id);
            }
        }
    };

    const handleCloseCommentModal = () => {
        setShowCommentModal(false);
        setCommentText("");
        setCurrentVideoForComment(null);
    };

    const addComment = async (videoId, text) => {
        try {
            const response = await axios.post("http://localhost:3000/api/food/comments", {
                foodId: videoId,
                text: text
            }, {
                withCredentials: true
            });
            
            // Update comment count locally
            setVideos(prev => prev.map(video => 
                video._id === videoId 
                    ? { ...video, commentCount: (video.commentCount || 0) + 1 }
                    : video
            ));
            
            return true;
            
        } catch (error) {
            console.error("Error adding comment:", error);
            if (error.response?.status === 401) {
                alert("Please login to comment on videos!");
                navigate("/");
            } else {
                alert("Failed to add comment. Please try again.");
            }
            return false;
        }
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
                    
                    {/* Right side action icons */}
                    <div className="video-actions">
                        <div className="action-item">
                            <button 
                                className={`action-btn like-btn ${likedVideos.has(video._id) ? 'liked' : ''}`}
                                onClick={() => handleLikeVideo(video._id)}
                                title="Like"
                            >
                                <span className="action-icon">
                                    {likedVideos.has(video._id) ? '❤️' : '🤍'}
                                </span>
                            </button>
                            <span className="action-count">{video.likeCount || 0}</span>
                        </div>
                        
                        <div className="action-item">
                            <button 
                                className={`action-btn save-btn ${savedVideos.has(video._id) ? 'saved' : ''}`}
                                onClick={() => handleSaveVideo(video._id)}
                                title="Save"
                            >
                                <span className="action-icon">
                                    {savedVideos.has(video._id) ? '🔖' : '🏷️'}
                                </span>
                            </button>
                            <span className="action-count">
                                {savedVideos.has(video._id) ? 'Saved' : 'Save'}
                            </span>
                        </div>
                        
                        <div className="action-item">
                            <button 
                                className="action-btn comment-btn"
                                onClick={() => handleCommentVideo(video._id)}
                                title="Comment"
                            >
                                <span className="action-icon">💬</span>
                            </button>
                            <span className="action-count">{video.commentCount || 0}</span>
                        </div>
                        
                        <div className="action-item">
                            <Link 
                                to="/create-food-partner" 
                                className="action-btn add-food-btn"
                                title="Add Food Item"
                            >
                                <span className="action-icon">➕</span>
                            </Link>
                            <span className="action-count">Add</span>
                        </div>
                    </div>

                    {/* Bottom overlay with description and store button */}
                    <div className="video-overlay">
                        <div className="video-content">
                            <div className="video-description">
                                <h4 className="video-title">
                                    {video.name}
                                </h4>
                                <p className="video-desc">{truncateText(video.description || `Delicious ${video.name} from ${video.storeName}`)}</p>
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
            
            {/* Comment Modal */}
            {showCommentModal && (
                <div className="comment-modal-overlay" onClick={handleCloseCommentModal}>
                    <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="comment-modal-header">
                            <h3>Comments</h3>
                            <button className="close-btn" onClick={handleCloseCommentModal}>
                                ✕
                            </button>
                        </div>
                        
                        <div className="comment-modal-body">
                            <div className="video-info-small">
                                <span className="video-name">{currentVideoForComment?.name}</span>
                                <span className="comment-count">{currentVideoForComment?.commentCount || 0} comments</span>
                            </div>
                            
                            {/* Comments List */}
                            <div className="comments-section">
                                {loadingComments ? (
                                    <div className="loading-comments">
                                        <div className="loading-spinner-small"></div>
                                        <span>Loading comments...</span>
                                    </div>
                                ) : comments.length > 0 ? (
                                    <div className="comments-list">
                                        {comments.map((comment) => (
                                            <div key={comment._id} className="comment-item">
                                                <div className="comment-author">
                                                    <span className="author-name">
                                                        {comment.user?.username || comment.user?.email || "Anonymous"}
                                                    </span>
                                                    <span className="comment-time">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="comment-text">
                                                    {comment.text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-comments">
                                        <span className="no-comments-icon">💬</span>
                                        <p>No comments yet. Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Add Comment Section */}
                            <div className="add-comment-section">
                                <textarea
                                    className="comment-input"
                                    placeholder="Share your thoughts about this delicious food..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    maxLength={500}
                                    rows={3}
                                />
                                
                                <div className="comment-actions">
                                    <button 
                                        className="cancel-btn" 
                                        onClick={handleCloseCommentModal}
                                    >
                                        Close
                                    </button>
                                    <button 
                                        className="submit-btn" 
                                        onClick={handleSubmitComment}
                                        disabled={!commentText.trim()}
                                    >
                                        Post Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <div className="bottom-nav">
                <Link to="/home" className="nav-item active">
                    <span className="nav-icon">🏠</span>
                    <span className="nav-label">Home</span>
                </Link>
                <Link to="/saved" className="nav-item">
                    <span className="nav-icon">🔖</span>
                    <span className="nav-label">Saved</span>
                </Link>
            </div>
        </div>
    );
};

export default Home;