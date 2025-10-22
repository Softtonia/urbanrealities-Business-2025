import { useState, useEffect, useRef } from "react";
import upload_img from "../../../img/upload.png";

const FeaturedImageUpload = ({ onChange, value }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [visible, setVisible] = useState(true);
  const fileInputRef = useRef(null); // ✅ Ref to reset input

  // ✅ Handle both string (URL) and File input from parent
  useEffect(() => {
    if (value instanceof File) {
      const imageUrl = URL.createObjectURL(value);
      setSelectedImage(imageUrl);
      setVisible(false);
    } else if (typeof value === "string" && value !== "") {
      setSelectedImage(value);
      setVisible(false);
    } else {
      setSelectedImage(null);
      setVisible(true);
    }
  }, [value]);

  console.log("selected image",selectedImage)

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setVisible(false);
      onChange(file); // Send file to parent

      // ✅ Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ✅ Handle image removal
  const handleRemove = () => {
    setSelectedImage(null);
    setVisible(true);
    onChange(null); // Clear image in parent

    // ✅ Reset input again when clearing
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="custom-file-upload" style={{ overflow: "hidden" }}>
      <div className="file-uploading-wraper" style={{ overflow: "hidden", position: "relative" }}>
        <input
          name="featured_img"
          type="file"
          ref={fileInputRef} // ✅ Apply ref here
          id="featuredImageInput"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {visible ? (
          <button
            className="w-100 h-100 upload-icon-wraper"
            type="button"
            onClick={() => document.getElementById("featuredImageInput").click()}
          >
            <img src={upload_img} alt="Upload" />
            <div className="ms-2" style={{ color: "var(--gray)" }}>
              Drag and drop or select a file
            </div>
          </button>
        ) : (
          <>
            <img
              src={selectedImage}
              alt="Preview"
              className="img-fluid h-100 w-100"
              style={{
                borderRadius: "12px",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
            />
            <span
              className="drop-img-wraper"
              onClick={handleRemove}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#E57373",
                color: "#fff",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              X
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedImageUpload;
