import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faPlay, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import ApiService, { api } from '../../../service/Apiservice.jsx';
import styles from './VideoTutorial.module.css';

const VideoTutorial = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null,
    thumbnail: null,
  });

  useEffect(() => {
    fetchVideos();
  }, [page, searchTerm]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const res = await ApiService.getVideoTutorialList({
        page,
        length: 12,
        search: searchTerm,
      });

      if (res.data.status === 'success') {
        setVideos(res.data.data);
        setTotalRecords(res.data.total_records);
      }
    } catch (error) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    // Validate video file size (100MB limit)
    if (name === 'video') {
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        toast.error('Video file size must be less than 100MB');
        e.target.value = ''; // Clear the file input
        return;
      }
    }

    // Validate thumbnail file size (10MB limit)
    if (name === 'thumbnail') {
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        toast.error('Thumbnail file size must be less than 10MB');
        e.target.value = ''; // Clear the file input
        return;
      }
    }

    setFormData({ ...formData, [name]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    if (!editMode && !formData.video) {
      toast.error('Video file is required');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.video) data.append('video', formData.video);
    if (formData.thumbnail) data.append('thumbnail', formData.thumbnail);

    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (editMode) {
        await ApiService.updateVideoTutorial(currentVideo.id, data);
        toast.success('Video updated successfully');
      } else {
        await ApiService.createVideoTutorial(data);
        toast.success('Video created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchVideos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (video) => {
    setCurrentVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      video: null,
      thumbnail: null,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this video?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('accessToken');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await ApiService.deleteVideoTutorial(id);
        toast.success('Video deleted successfully');
        fetchVideos();
      } catch (error) {
        toast.error('Failed to delete video');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video: null,
      thumbnail: null,
    });
    setEditMode(false);
    setCurrentVideo(null);
  };

  const handleSearch = () => {
    setPage(1);
    fetchVideos();
  };

  const handlePlayVideo = (video) => {
    setPlayingVideo(video);
    setShowVideoPlayer(true);
  };

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
    setPlayingVideo(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Video Tutorials</h2>
          <p className={styles.subtitle}>Manage instructional videos</p>
        </div>
        <button
          className={styles.btnAdd}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Video
        </button>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button className={styles.btnSearch} onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} /> Search
        </button>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className={styles.loader}>Loading...</div>
      ) : (
        <div className="row g-3">
          {videos.map((video) => (
            <div key={video.id} className="col-12 col-md-6 col-lg-4">
              <div className={styles.videoCard}>
                <div className={styles.videoThumbnail}>
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} />
                  ) : (
                    <div className={styles.placeholderThumbnail}>
                      <FontAwesomeIcon icon={faPlay} />
                    </div>
                  )}
                </div>
                <div className={styles.videoContent}>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                  <p className={styles.videoDescription}>{video.description}</p>
                  <div className={styles.videoActions}>
                    <button
                      className={styles.btnPlay}
                      onClick={() => handlePlayVideo(video)}
                    >
                      <FontAwesomeIcon icon={faPlay} /> Play
                    </button>
                    <button
                      className={styles.btnEdit}
                      onClick={() => handleEdit(video)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDelete(video.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalRecords > 12 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={styles.btnPage}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {Math.ceil(totalRecords / 12)}
          </span>
          <button
            disabled={page === Math.ceil(totalRecords / 12)}
            onClick={() => setPage(page + 1)}
            className={styles.btnPage}
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editMode ? 'Edit Video' : 'Add Video'}</h3>
              <button
                className={styles.btnClose}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>

              {/* Current Video Display */}
              {editMode && currentVideo?.video && (
                <div className={styles.formGroup}>
                  <label>Current Video</label>
                  <div className={styles.currentMediaPreview}>
                    <video
                      src={currentVideo.video}
                      controls
                      className={styles.previewVideo}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <p className={styles.previewLabel}>Current video will be replaced if you upload a new one</p>
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Video {!editMode && '*'}</label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleFileChange}
                  required={!editMode}
                />
                <small className={styles.helpText}>
                  {editMode ? 'Leave empty to keep current video. ' : ''}
                  Maximum file size: 100MB
                </small>
              </div>

              {/* Current Thumbnail Display */}
              {editMode && currentVideo?.thumbnail && (
                <div className={styles.formGroup}>
                  <label>Current Thumbnail</label>
                  <div className={styles.currentMediaPreview}>
                    <img
                      src={currentVideo.thumbnail}
                      alt="Current thumbnail"
                      className={styles.previewThumbnail}
                    />
                    <p className={styles.previewLabel}>Current thumbnail will be replaced if you upload a new one</p>
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Thumbnail</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <small className={styles.helpText}>
                  {editMode ? 'Leave empty to keep current thumbnail. ' : ''}
                  Maximum file size: 10MB
                </small>
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="submit" 
                  className={styles.btnSubmit}
                  disabled={submitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting && (
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }}
                    />
                  )}
                  {submitting ? 'Submitting...' : (editMode ? 'Update' : 'Create')}
                </button>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </form>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoPlayer && playingVideo && (
        <div className={styles.videoPlayerOverlay} onClick={handleCloseVideoPlayer}>
          <div className={styles.videoPlayerContainer} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeVideoBtn} onClick={handleCloseVideoPlayer}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className={styles.videoPlayerHeader}>
              <h3>{playingVideo.title}</h3>
              {playingVideo.description && <p>{playingVideo.description}</p>}
            </div>
            <div className={styles.videoPlayerWrapper}>
              <video
                src={playingVideo.video}
                controls
                autoPlay
                className={styles.videoPlayer}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTutorial;
