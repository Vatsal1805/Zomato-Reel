import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateFood.css";

const CreateFood = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        video: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [videoPreview, setVideoPreview] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("");
    const navigate = useNavigate();

    // Check if user is authenticated as food partner
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                // Check food partner authentication
                const response = await axios.get("http://localhost:3000/api/foodpartner/auth/check", {
                    withCredentials: true
                });
                console.log("Food partner authenticated:", response.data);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Authentication check failed:", error);
                
                // For development purposes, let's be less strict about authentication
                // Comment out the following lines if you want to test without authentication
                if (error.response?.status === 401) {
                    console.log("Not authenticated as food partner, redirecting to login...");
                    setError("Please login as a food partner to add food items");
                    // Reduce redirect time for better UX
                    setTimeout(() => {
                        navigate("/food-partner/login");
                    }, 1500);
                } else {
                    setError("Failed to verify authentication. Please try again.");
                }
                setIsAuthenticated(false);
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAuthentication();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear messages when user starts typing
        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
            if (!validTypes.includes(file.type)) {
                setError("Please select a valid video file (MP4, AVI, MOV, WMV, WebM)");
                return;
            }

            // Validate file size (max 50MB)
            const maxSize = 50 * 1024 * 1024; // 50MB in bytes
            const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
            
            if (file.size > maxSize) {
                setError(`Video file is too large (${fileSizeMB}MB). Please select a file smaller than 50MB.`);
                return;
            }
            
            console.log(`Selected video file: ${file.name} (${fileSizeMB}MB)`);

            setFormData(prev => ({
                ...prev,
                video: file
            }));

            // Create video preview
            const videoUrl = URL.createObjectURL(file);
            setVideoPreview(videoUrl);
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name.trim()) {
            setError("Food item name is required");
            return;
        }
        if (!formData.description.trim()) {
            setError("Description is required");
            return;
        }
        if (!formData.video) {
            setError("Please select a video file");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");
        setUploadProgress(0);
        setUploadStatus("Preparing upload...");

        try {
            // Create FormData for file upload
            const uploadData = new FormData();
            uploadData.append("name", formData.name.trim());
            uploadData.append("description", formData.description.trim());
            uploadData.append("video", formData.video);

            console.log("Starting food item upload...");
            setUploadStatus("Uploading video...");

            const response = await axios.post(
                "http://localhost:3000/api/food",
                uploadData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                    timeout: 120000, // 2 minutes timeout
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                        
                        if (percentCompleted < 100) {
                            setUploadStatus(`Uploading video... ${percentCompleted}%`);
                        } else {
                            setUploadStatus("Processing video...");
                        }
                    },
                }
            );

            console.log("Food item created successfully:", response.data);
            setUploadStatus("Upload completed!");
            setUploadProgress(100);
            setSuccess("Food item added successfully! 🎉");
            
            // Reset form
            setFormData({
                name: "",
                description: "",
                video: null
            });
            setVideoPreview("");
            setUploadProgress(0);
            setUploadStatus("");
            
            // Redirect to home after 3 seconds to show success message
            setTimeout(() => {
                navigate("/home");
            }, 3000);

        } catch (error) {
            console.error("Error creating food item:", error);
            
            setUploadProgress(0);
            setUploadStatus("");
            
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                setError("Upload timeout. Please try with a smaller video file or check your internet connection.");
            } else if (error.response?.status === 401) {
                setError("Please login as a food partner to add food items");
                setTimeout(() => {
                    navigate("/food-partner/login");
                }, 2000);
            } else if (error.response?.status === 413) {
                setError("File too large. Please select a video file smaller than 50MB.");
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.message.includes('Network Error')) {
                setError("Network error. Please check your internet connection and try again.");
            } else {
                setError("Failed to add food item. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBackToHome = () => {
        navigate("/home");
    };

    // Show loading while checking authentication
    if (checkingAuth) {
        return (
            <div className="create-food-container">
                <div className="create-food-card">
                    <div className="auth-check-loading">
                        <div className="spinner"></div>
                        <p>Checking authentication...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="create-food-container">
                <div className="create-food-card">
                    <div className="auth-error">
                        <h2>🔒 Access Restricted</h2>
                        <p>Only food partners can add food items.</p>
                        <p>Redirecting to login page...</p>
                        <button onClick={() => navigate("/food-partner/login")} className="login-redirect-btn">
                            Login as Food Partner
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="create-food-container">
            <div className="create-food-card">
                {/* Header */}
                <div className="create-food-header">
                    <button onClick={handleBackToHome} className="back-btn">
                        <span>←</span> Back
                    </button>
                    <h1 className="page-title">Add New Food Item</h1>
                    <p className="page-subtitle">Share your delicious creation with the world</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="create-food-form">
                    {/* Food Name Input */}
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            <span className="label-icon">🍽️</span>
                            Food Item Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Butter Chicken, Margherita Pizza"
                            className="form-input"
                            disabled={loading}
                        />
                    </div>

                    {/* Description Input */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            <span className="label-icon">📝</span>
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your food item, ingredients, or what makes it special..."
                            className="form-textarea"
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    {/* Video Upload */}
                    <div className="form-group">
                        <label htmlFor="video" className="form-label">
                            <span className="label-icon">🎥</span>
                            Food Video
                        </label>
                        <div className="video-upload-section">
                            <input
                                type="file"
                                id="video"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="video-input"
                                disabled={loading}
                            />
                            <label htmlFor="video" className="video-upload-label">
                                {formData.video ? (
                                    <div className="upload-success">
                                        <span className="upload-icon">✅</span>
                                        <span className="upload-text">{formData.video.name}</span>
                                        <span className="upload-subtext">Click to change</span>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <span className="upload-icon">📁</span>
                                        <span className="upload-text">Choose Video File</span>
                                        <span className="upload-subtext">MP4, AVI, MOV, WMV, WebM (Max 50MB)</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Video Preview */}
                        {videoPreview && (
                            <div className="video-preview">
                                <h4>Preview:</h4>
                                <video 
                                    src={videoPreview} 
                                    controls 
                                    className="preview-video"
                                    muted
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="success-message">
                            <span className="success-icon">✅</span>
                            {success}
                        </div>
                    )}

                    {/* Upload Progress */}
                    {loading && uploadStatus && (
                        <div className="upload-progress">
                            <div className="progress-info">
                                <span className="progress-text">{uploadStatus}</span>
                                {uploadProgress > 0 && (
                                    <span className="progress-percentage">{uploadProgress}%</span>
                                )}
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className={`submit-btn ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="loading-content">
                                <div className="spinner"></div>
                                <span>{uploadStatus || "Processing..."}</span>
                            </div>
                        ) : (
                            <div className="submit-content">
                                <span className="submit-icon">🚀</span>
                                <span>Add Food Item</span>
                            </div>
                        )}
                    </button>
                </form>

                {/* Tips Section */}
                <div className="tips-section">
                    <h3>💡 Tips for great food videos:</h3>
                    <ul className="tips-list">
                        <li>📱 Record in vertical orientation for mobile viewers</li>
                        <li>💡 Ensure good lighting to showcase your food</li>
                        <li>🔍 Keep the video focused on the food item</li>
                        <li>⏱️ Keep videos between 15-60 seconds for best engagement</li>
                        <li>🎵 Consider adding background music (optional)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateFood;