import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import styles from "./Cropper.module.css";

const ImageCropperModal = ({ src, onCrop, onClose }) => {
  const cropperRef = useRef(null);

 const handleCrop = () => {
  const cropper = cropperRef.current?.cropper;

  cropper.getCroppedCanvas({
    transparent: true, // IMPORTANT
  }).toBlob((blob) => {
    const file = new File([blob], "signature.png", {
      type: "image/png", // ✅ PNG
    });
    onCrop(file);
  }, "image/png"); // ✅ FORCE PNG
};


  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h5 className={styles.title}>Crop Image</h5>

        <div className={styles.cropperWrapper}>
          <Cropper
            src={src}
            ref={cropperRef}
            style={{ height: "100%", width: "100%" }}
            viewMode={1}
            guides={false}
            background={false}
            responsive
            autoCropArea={1}
            checkOrientation={false}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleCrop}>
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
