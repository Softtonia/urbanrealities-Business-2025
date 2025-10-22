import { useEffect, useState, useRef } from "react";
import upload_img from "../../../img/upload.png";
import "./MediaUploader.css";

const MediaUploadEdit = ({ groupIndex, record, handleChangeRepeater, errors, value = [] }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const inputRef = useRef(null);
    const [localError, setLocalError] = useState("");


    console.log("check on record", record)

    // Generate simple unique ID
    const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 5);

    const filesizes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };
    console.log("check media", record)

    useEffect(() => {
        if (Array.isArray(value) && value.length > 0) {
            const initialized = value.map((item) => {
                const isFile = item instanceof File;
                const isString = typeof item === "string";
    
                if (!isFile && !isString) {
                    console.warn("Skipping invalid file item:", item);
                    return null;
                }
    
                return {
                    id: generateId(),
                    filename: isFile ? item.name : item.split("/").pop(),
                    filetype: isFile ? item.type : "image/url",
                    fileimage: isFile ? URL.createObjectURL(item) : item,
                    datetime: isFile ? item.lastModifiedDate?.toLocaleString("en-IN") : "Previously uploaded",
                    filesize: isFile ? filesizes(item.size) : "Unknown",
                    file: isFile ? item : item.split("/").pop(),
                    isRemote: !isFile, // ✅ this line is important
                };
            }).filter(Boolean);
    
            setSelectedFiles(initialized);
        }
    }, [value]);
    




    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const allowedFormats = record.media_format
            ? record.media_format.split(",").map((f) => f.trim().toLowerCase())
            : [];
        const maxSize = parseFloat(record.media_size || 5);
        const maxFiles = parseInt(record.media_limit || 5);
    
        const validatedFiles = [];
    
        for (let file of newFiles) {
            const fileSizeMB = file.size / 1024 / 1024;
            const extension = file.name.split(".").pop().toLowerCase();
    
            if (allowedFormats.length && !allowedFormats.includes(extension)) {
                setLocalError(`Only ${allowedFormats.join(", ")} files allowed.`);
                return;
            }
            if (fileSizeMB > maxSize) {
                setLocalError(`File must be less than ${maxSize} MB.`);
                return;
            }
    
            validatedFiles.push({
                id: generateId(),
                filename: file.name,
                filetype: file.type,
                fileimage: URL.createObjectURL(file),
                datetime: file.lastModifiedDate?.toLocaleString("en-IN"),
                filesize: filesizes(file.size),
                file,
                isRemote: false,
            });
        }
    
        // ✅ Preserve existing remote links
        const preservedRemoteFiles = selectedFiles.filter(f => f.isRemote);
    
        // ✅ Combine remote + new
        const updatedFiles = [...preservedRemoteFiles, ...validatedFiles];
    
        if (updatedFiles.length > maxFiles) {
            setLocalError(`Maximum ${maxFiles} files allowed.`);
            return;
        }
    
        setSelectedFiles(updatedFiles);
        setLocalError("");
    
        // ✅ Send back correct structure (files and URLs)
        const mergedValue = updatedFiles.map(f => f.isRemote ? f.fileimage : f.file);
    
        handleChangeRepeater(
            {
                target: {
                    name: "field_value",
                    value: mergedValue,
                    files: mergedValue,
                },
            },
            record.custom_field_id,
            record.id,
            record.field_type,
            groupIndex,
            "field_value"
        );
    
        console.log("selected files", updatedFiles);
    };
    
    const handleRemove = (id) => {
        const updated = selectedFiles.filter((f) => f.id !== id);
        setSelectedFiles(updated);

        // Separate remote URLs and File objects
        const updatedFiles = updated.map((f) => f.file);

        handleChangeRepeater(
            {
                target: {
                    name: "field_value",
                    value: updatedFiles,
                    files: updatedFiles,
                },
            },
            record.custom_field_id,
            record.id,
            record.field_type,
            groupIndex,
            "field_value",
            
        );
    };

    console.log("fetched selected ", selectedFiles)

    return (
        <div className="custom-file-upload">
            {/* <label className="mb-2 text-capitalize">
          {record.field_label} {record.required === "yes" && <span style={{ color: "var(--orange)" }}>*</span>}
        </label> */}
            <div className="kb-attach-box mb-3 file-uploading-wraper w-100 input-media-field-wraper">
                <input
                    ref={inputRef}
                    multiple
                    name="field_value"
                    type="file"
                    accept={record.field_type === "media" ? "image/*" : "*"}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                <button
                    type="button"
                    className="upload-icon-wraper w-100 h-100"
                    onClick={() => inputRef.current.click()}
                >
                    <img src={upload_img} alt="Upload" />
                    <div className="ms-2">Drag and drop or select an image</div>
                </button>
            </div>

            <div className="kb-attach-box mb-3 media-output-show">
                {selectedFiles.map((file) => (
                    <div className="file-atc-box" key={file.id}>
                        {file.filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                            <div className="file-image">
                                <img src={file.fileimage} alt={file.filename} />
                            </div>
                        ) : (
                            <div className="file-image">
                                <i className="far fa-file-alt"></i>
                            </div>
                        )}
                        <div className="file-detail">
                            <h6>{file.filename}</h6>
                            <p><span>Size: {file.filesize}</span><span className="ml-2">Modified: {file.datetime}</span></p>
                            <div className="file-actions">
                                <button type="button" className="file-action-btn" onClick={() => handleRemove(file.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(localError || typeof errors === "string") && (
                <div className="text-danger mt-1">{localError || errors}</div>
            )}
        </div>
    );
};

export default MediaUploadEdit;
