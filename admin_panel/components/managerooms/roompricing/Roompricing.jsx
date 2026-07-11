import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Roompricing.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faIndianRupeeSign, faBed, faEdit, faTags,
  faPercent, faCalendarAlt, faSave
} from "@fortawesome/free-solid-svg-icons";

const RoomPricing = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => { 
    localStorage.clear();
    sessionStorage.clear();
    toast.info("You have been logged out", { autoClose: 1000 });
    navigate("/adminlogin");
  };

  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  
  const [priceFormData, setPriceFormData] = useState({
    price: '',
    taxes: '',
    discount: 0,
    seasonal_price: ''
  });

  // Fetch room types
  const fetchRoomTypes = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.getAllRoomTypes();
      const data = response.data;

      if (data.status === "success") {
        setRoomTypes(data.data || []);
      } else {
        toast.error(data.message || "Failed to load room types");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(error);
      toast.error("❌ Error fetching room types");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleEditPrice = (roomType) => {
    setEditingPrice(roomType);
    setPriceFormData({
      price: roomType.price || '',
      taxes: roomType.taxes || '',
      discount: 0,
      seasonal_price: ''
    });
    setShowPriceModal(true);
  };

  const handleSubmitPrice = async (e) => {
    e.preventDefault();

    const payload = {
      name: editingPrice.name,
      description: editingPrice.description,
      price: parseFloat(priceFormData.price),
      capacity: editingPrice.capacity,
      bed_type: editingPrice.bed_type,
      room_dimensions: editingPrice.room_dimensions,
      taxes: priceFormData.taxes,
      no_of_rooms_available: editingPrice.no_of_rooms_available,
      room_images: editingPrice.room_images,
      room_features: editingPrice.room_features,
      available_dates: editingPrice.available_dates
    };

    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.updateRoomType(editingPrice.id, payload);
      const data = response.data;

      if (data.status === "success") {
        toast.success("✅ Pricing updated successfully!");
        fetchRoomTypes();
        handleCloseModal();
      } else {
        toast.error(data.message || "⚠️ Failed to update pricing.");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error("Pricing update error:", error);
      toast.error("❌ Something went wrong while updating pricing.");
    }
  };

  const handleCloseModal = () => {
    setShowPriceModal(false);
    setEditingPrice(null);
    setPriceFormData({
      price: '',
      taxes: '',
      discount: 0,
      seasonal_price: ''
    });
  };

  const calculateFinalPrice = (basePrice, discount) => {
    const price = parseFloat(basePrice) || 0;
    const disc = parseFloat(discount) || 0;
    return price - (price * disc / 100);
  };

  return (
    <div className={styles.container}>
      <ToastContainer 
        position="top-right"
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>
            <FontAwesomeIcon icon={faIndianRupeeSign} /> Room Pricing Management
          </h2>
          <p className={styles.subtitle}>Manage room rates, taxes, and pricing strategies</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.userBadge}>Admin</div>
        </div>
      </div>

      {/* Pricing Info */}
      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>
          <FontAwesomeIcon icon={faTags} />
        </div>
        <div className={styles.infoContent}>
          <h4>Dynamic Pricing</h4>
          <p>Update room rates, apply seasonal pricing, manage taxes and discounts for all room types</p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading pricing data...</p>
        </div>
      ) : (
        <div className={styles.pricingGrid}>
          {roomTypes.map((roomType) => (
            <div key={roomType.id} className={styles.pricingCard}>
              <div className={styles.cardHeader}>
                <div className={styles.roomInfo}>
                  <h3>{roomType.name}</h3>
                  <p>{roomType.description}</p>
                </div>
                <button 
                  className={styles.editPriceBtn}
                  onClick={() => handleEditPrice(roomType)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit Pricing
                </button>
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.priceDisplay}>
                  <div className={styles.mainPrice}>
                    <span className={styles.currency}>₹</span>
                    <span className={styles.amount}>{parseFloat(roomType.price).toFixed(2)}</span>
                    <span className={styles.period}>/night</span>
                  </div>
                  {roomType.taxes && (
                    <div className={styles.taxInfo}>
                      <FontAwesomeIcon icon={faPercent} /> {roomType.taxes}
                    </div>
                  )}
                </div>

                <div className={styles.roomDetails}>
                  <div className={styles.detailItem}>
                    <FontAwesomeIcon icon={faBed} />
                    <span>{roomType.bed_type || 'Standard'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.capacity}>Capacity: {roomType.capacity} guests</span>
                  </div>
                  {roomType.room_dimensions && (
                    <div className={styles.detailItem}>
                      <span>{roomType.room_dimensions}</span>
                    </div>
                  )}
                </div>

                <div className={styles.priceBreakdown}>
                  <div className={styles.breakdownItem}>
                    <span>Base Rate</span>
                    <strong>₹{parseFloat(roomType.price).toFixed(2)}</strong>
                  </div>
                  {roomType.taxes && (
                    <div className={styles.breakdownItem}>
                      <span>Taxes</span>
                      <strong>{roomType.taxes}</strong>
                    </div>
                  )}
                  <div className={styles.breakdownItem}>
                    <span>Available Units</span>
                    <strong>{roomType.units_count || 0} rooms</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Price Edit Modal */}
      {showPriceModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FontAwesomeIcon icon={faIndianRupeeSign} /> Edit Pricing - {editingPrice?.name}
              </h3>
              <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmitPrice} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FontAwesomeIcon icon={faIndianRupeeSign} /> Base Price per Night (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.formInput}
                    value={priceFormData.price}
                    onChange={(e) => setPriceFormData({ ...priceFormData, price: e.target.value })}
                    required
                    placeholder="e.g., 2999.00"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FontAwesomeIcon icon={faPercent} /> Taxes & Charges
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={priceFormData.taxes}
                    onChange={(e) => setPriceFormData({ ...priceFormData, taxes: e.target.value })}
                    placeholder="e.g., 18% GST, Service Charge"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FontAwesomeIcon icon={faTags} /> Discount (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.formInput}
                    value={priceFormData.discount}
                    onChange={(e) => setPriceFormData({ ...priceFormData, discount: e.target.value })}
                    placeholder="e.g., 10"
                  />
                  {priceFormData.discount > 0 && (
                    <div className={styles.discountInfo}>
                      Final Price: ₹{calculateFinalPrice(priceFormData.price, priceFormData.discount).toFixed(2)}
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FontAwesomeIcon icon={faCalendarAlt} /> Seasonal Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.formInput}
                    value={priceFormData.seasonal_price}
                    onChange={(e) => setPriceFormData({ ...priceFormData, seasonal_price: e.target.value })}
                    placeholder="Special/Peak season rate"
                  />
                  <small className={styles.helpText}>
                    Set a different rate for peak/off-peak seasons
                  </small>
                </div>
              </div>

              <div className={styles.pricePreview}>
                <h4>Price Summary</h4>
                <div className={styles.previewGrid}>
                  <div className={styles.previewItem}>
                    <span>Base Rate</span>
                    <strong>₹{parseFloat(priceFormData.price || 0).toFixed(2)}</strong>
                  </div>
                  <div className={styles.previewItem}>
                    <span>Discount</span>
                    <strong className={styles.discountText}>
                      {priceFormData.discount}% off
                    </strong>
                  </div>
                  <div className={styles.previewItem}>
                    <span>Final Price</span>
                    <strong className={styles.finalPrice}>
                      ₹{calculateFinalPrice(priceFormData.price, priceFormData.discount).toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  <FontAwesomeIcon icon={faSave} /> Save Pricing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPricing;
