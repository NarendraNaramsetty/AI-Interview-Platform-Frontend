import React, { useState, useRef, useEffect } from 'react';
import styles from './ProfileImageUpload.module.css';
import Swal from 'sweetalert2';

const ProfileImageUpload = ({ 
    existingImage = null, 
    onImageChange, 
    onImageRemove 
}) => {
    const [activeTab, setActiveTab] = useState('file');
    const [webcamActive, setWebcamActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(existingImage);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setPreviewImage(existingImage);
    }, [existingImage]);

    useEffect(() => {
        return () => stopWebcam();
    }, []);

    // File Upload Functions
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should not exceed 5MB');
                return;
            }

            // Preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);

            // Notify parent
            onImageChange({
                type: 'file',
                data: file
            });
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Webcam Functions
    const startWebcam = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Unable to access webcam: Webcam access requires a secure connection (HTTPS) or localhost. Please check your browser URL.');
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
            setWebcamActive(true);
        } catch (error) {
            alert('Unable to access webcam: ' + error.message);
        }
    };

    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            setWebcamActive(false);
        }
    };

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        setPreviewImage(imageData);
        stopWebcam();

        // Notify parent
        onImageChange({
            type: 'webcam',
            data: imageData,
            format: 'jpeg'
        });
    };

    const retakeImage = () => {
        setCapturedImage(null);
        setPreviewImage(existingImage);
        startWebcam();
    };

    const handleRemoveImage = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to remove the profile image?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            focusCancel: true
        });

        if (result.isConfirmed) {
            setPreviewImage(null);
            setCapturedImage(null);
            onImageRemove();
        }
    };

    return (
        <div className={styles.profileImageUpload}>
            {/* Preview Section */}
            {previewImage && (
                <div className={styles.imagePreviewSection}>
                    <img src={previewImage} alt="Profile" className={styles.previewImage} />
                    <button 
                        type="button"
                        className={styles.btnRemove} 
                        onClick={handleRemoveImage}
                    >
                        🗑️ Remove Image
                    </button>
                </div>
            )}

            {/* Tab Navigation */}
            <div className={styles.uploadTabs}>
                <button
                    type="button"
                    className={`${styles.tabBtn} ${activeTab === 'file' ? styles.active : ''}`}
                    onClick={() => {
                        setActiveTab('file');
                        stopWebcam();
                    }}
                >
                    📁 Upload File
                </button>
                <button
                    type="button"
                    className={`${styles.tabBtn} ${activeTab === 'webcam' ? styles.active : ''}`}
                    onClick={() => setActiveTab('webcam')}
                >
                    📷 Webcam
                </button>
            </div>

            {/* File Upload Tab */}
            {activeTab === 'file' && (
                <div className={styles.tabContent}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <button 
                        type="button"
                        className={styles.btnPrimary} 
                        onClick={triggerFileInput}
                    >
                        📁 Choose File
                    </button>
                    <p className={styles.helpText}>Select an image from your computer (Max 5MB)</p>
                </div>
            )}

            {/* Webcam Tab */}
            {activeTab === 'webcam' && (
                <div className={styles.tabContent}>
                    {!webcamActive && !capturedImage && (
                        <button 
                            type="button"
                            className={styles.btnPrimary} 
                            onClick={startWebcam}
                        >
                            📷 Start Camera
                        </button>
                    )}

                    {webcamActive && (
                        <div className={styles.webcamContainer}>
                            <video ref={videoRef} autoPlay playsInline className={styles.webcamVideo} />
                            <div className={styles.webcamControls}>
                                <button 
                                    type="button"
                                    className={styles.btnSuccess} 
                                    onClick={captureImage}
                                >
                                    📸 Capture
                                </button>
                                <button 
                                    type="button"
                                    className={styles.btnDanger} 
                                    onClick={stopWebcam}
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {capturedImage && (
                        <div className={styles.capturedActions}>
                            <button 
                                type="button"
                                className={styles.btnSecondary} 
                                onClick={retakeImage}
                            >
                                🔄 Retake
                            </button>
                        </div>
                    )}

                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
            )}
        </div>
    );
};

export default ProfileImageUpload;
