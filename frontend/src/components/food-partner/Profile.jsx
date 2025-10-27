import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { partnerId } = useParams();
    
    // State for real data
    const [partnerData, setPartnerData] = useState(null);
    const [statistics, setStatistics] = useState({ totalMeals: 0, customersServed: 0 });
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch real partner data
    useEffect(() => {
        const fetchPartnerProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/foodpartner/${partnerId}`, {
                    withCredentials: true
                });
                
                if (response.data && response.data.foodPartner) {
                    console.log("Partner data received:", response.data.foodPartner);
                    console.log("Statistics received:", response.data.statistics);
                    console.log("Videos received:", response.data.foodItems);
                    setPartnerData(response.data.foodPartner);
                    setStatistics(response.data.statistics);
                    setVideos(response.data.foodItems);
                    setError(null);
                } else {
                    console.log("No partner data found in response:", response.data);
                    setError("Partner data not found");
                }
            } catch (error) {
                console.error("Error fetching partner profile:", error);
                console.error("Error response:", error.response?.data);
                console.error("Error status:", error.response?.status);
                if (error.response?.status === 401) {
                    alert("Please login to view this profile!");
                    navigate("/");
                } else if (error.response?.status === 404) {
                    setError("Food partner not found");
                } else {
                    setError("Failed to load partner profile");
                }
            } finally {
                setLoading(false);
            }
        };

        if (partnerId) {
            fetchPartnerProfile();
        }
    }, [partnerId, navigate]);

    const handleBackToHome = () => {
        navigate('/home');
    };

    // Loading state
    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading partner profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="profile-container">
                <div className="error-container">
                    <h2>😔 Oops!</h2>
                    <p>{error}</p>
                    <button onClick={handleBackToHome} className="back-home-btn">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // No partner data
    if (!partnerData) {
        return (
            <div className="profile-container">
                <div className="error-container">
                    <h2>Partner not found</h2>
                    <button onClick={handleBackToHome} className="back-home-btn">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Back Button */}
            <div className="back-button" onClick={handleBackToHome}>
                <span>←</span> Back to Videos
            </div>

            {/* Header Section */}
            <div className="profile-header">
                <div className="business-info">
                    <div className="business-logo">
                        <div className="logo-circle">
                            {partnerData.restaurantName?.charAt(0)?.toUpperCase()}
                        </div>
                    </div>
                    <div className="business-details">
                        <h1 className="restaurant-name">
                            {partnerData.restaurantName || partnerData.ownerName}
                        </h1>
                        <div className="owner-info">
                            {partnerData.restaurantName && partnerData.ownerName && (
                                <p className="owner-name">Owner: {partnerData.ownerName}</p>
                            )}
                        </div>
                        <div className="contact-info">
                            {partnerData.address && (
                                <div className="address-info">
                                    <span className="info-icon">📍</span>
                                    <span className="address-text">{partnerData.address}</span>
                                </div>
                            )}
                            {partnerData.phone && (
                                <div className="phone-info">
                                    <span className="info-icon">📞</span>
                                    <span className="phone-text">{partnerData.phone}</span>
                                </div>
                            )}
                            {partnerData.email && (
                                <div className="email-info">
                                    <span className="info-icon">✉️</span>
                                    <span className="email-text">{partnerData.email}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
                <div className="stat-item">
                    <div className="stat-label">total meals</div>
                    <div className="stat-value">{statistics.totalMeals}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">customer serve</div>
                    <div className="stat-value">{statistics.customersServed}</div>
                </div>
            </div>

            {/* Videos Section */}
            <div className="videos-section">
                <div className="videos-header">
                    <h2 className="videos-title">Food Videos</h2>
                </div>
                
                <div className={`video-grid ${videos.length === 0 ? 'empty-grid' : ''}`}>
                    {videos.length > 0 ? (
                        videos.map((video, index) => (
                            <div 
                                key={video._id} 
                                className="video-thumbnail" 
                                onClick={() => window.open(video.videoUrl, '_blank')}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <video 
                                    src={video.videoUrl} 
                                    className="video-preview"
                                    muted
                                    preload="metadata"
                                />
                                <div className="video-overlay-grid">
                                    <div className="video-info">
                                        <span className="video-name">{video.name}</span>
                                        {video.description && (
                                            <span className="video-description">{video.description}</span>
                                        )}
                                    </div>
                                    <div className="play-button">
                                        <span>▶</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-videos">
                            <div className="no-videos-icon">🎥</div>
                            <h3>No videos yet</h3>
                            <p>This food partner hasn't uploaded any videos yet. Check back later!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;