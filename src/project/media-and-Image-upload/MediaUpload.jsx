import { useState, useRef, useEffect } from "react";
import upload_img from "../../../img/upload.png";
import "./MediaUploader.css";

const MediaUpload = ({ record, handleChange, errors, value = [] }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const inputRef = useRef(null);

  const [localError, setLocalError] = useState("");

  console.log("record", value)
  console.log("INCOMING:", record.field_label, record.field_value);


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

  // ✅ only run once
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!hasInitializedRef.current && Array.isArray(value) && value.length > 0) {
      const initialized = value.map((item) => {
        // Case: New File upload
        if (item instanceof File) {
          return {
            id: generateId(),
            filename: item.name,
            filetype: item.type,
            fileimage: URL.createObjectURL(item),
            datetime: item.lastModifiedDate?.toLocaleString("en-IN"),
            filesize: filesizes(item.size),
            file: item,
            isRemote: false,
          };
        }
  
        // Case: Remote object with file_url and file_name
        if (typeof item === "object" && item.file_url && item.file_name) {
          return {
            id: generateId(),
            filename: item.file_name,
            filetype: "url",
            fileimage: item.file_url,
            datetime: "Previously uploaded",
            filesize: "Unknown",
            file: {
              file_url: item.file_url,
              file_name: item.file_name,
            },
            isRemote: true,
          };
        }
  
        // Case: Remote string URL
        if (typeof item === "string") {
          const fileName = item.split("/").pop();
          return {
            id: generateId(),
            filename: fileName,
            filetype: "url",
            fileimage: item,
            datetime: "Previously uploaded",
            filesize: "Unknown",
            file: {
              file_url: item,
              file_name: fileName,
            },
            isRemote: true,
          };
        }
  
        return null;
      }).filter(Boolean); // Filter out nulls
  
      setSelectedFiles(initialized);
      hasInitializedRef.current = true;
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
        isRemote: false, // ✅ Add this
      });
    }

    if (selectedFiles.length + validatedFiles.length > maxFiles) {
      setLocalError(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    const updatedFiles = [...selectedFiles, ...validatedFiles];
    setSelectedFiles(updatedFiles); // ✅ trigger re-render

    console.log("✅ updated selectedFiles", updatedFiles); // ✅ log correct data

    setLocalError("");
    console.log(selectedFiles)

    handleChange(
      {
        target: {
          name: "field_value",
          value: updatedFiles.map((f) =>
            f.isRemote ? f.fileimage : f.file
          ),
        },
      },
      record.id || record.custom_field_id,
      record.field_type
    );
    
    console.log("selected files", updatedFiles)
  };

  const handleRemove = (id) => {
    const updated = selectedFiles.filter((f) => f.id !== id);
    setSelectedFiles(updated);

    // Use `updated` directly, since it has the full metadata
    const updatedFiles = updated.map((f) =>
      f.isRemote
        ? f.fileimage 
        : f.file
    );
    console.log("updated files==>",updatedFiles)
    handleChange(
      {
        target: {
          name: "field_value",
          value: updatedFiles,
        },
      },
      record.id || record.custom_field_id,
      record.field_type
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

          accept={
            record.field_type === 'media'
              ? 'image/*'
              : record.media_format &&
              record.media_format.split(',')
                .map((ext) => {
                  switch (ext) {
                    case 'pdf':
                      return 'application/pdf';
                    case 'doc':
                      return 'application/msword';
                    case 'docx':
                      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    default:
                      return ext.startsWith('.') ? ext : `.${ext}`;
                  }
                })
                .join(',')
          }
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          className="upload-icon-wraper w-100 h-100"
          onClick={() => inputRef.current.click()}
        >
          <img src={upload_img} alt="Upload" />
          <div className="ms-2">Drag and drop here </div>
        </button>
      </div>

      <div className="kb-attach-box mb-3 media-output-show">
        {selectedFiles.map((file) => (
          <div className="file-atc-box" key={file.id}>
            <div className="file-image">
              {file.filename.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) ? (
                <img src={file.fileimage} alt={file.filename} />
              ) : file.filename.match(/\.pdf$/i) ? (
                <svg width="40px" height="40px" viewBox="-4 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25.6686 26.0962C25.1812 26.2401 24.4656 26.2563 23.6984 26.145C22.875 26.0256 22.0351 25.7739 21.2096 25.403C22.6817 25.1888 23.8237 25.2548 24.8005 25.6009C25.0319 25.6829 25.412 25.9021 25.6686 26.0962ZM17.4552 24.7459C17.3953 24.7622 17.3363 24.7776 17.2776 24.7939C16.8815 24.9017 16.4961 25.0069 16.1247 25.1005L15.6239 25.2275C14.6165 25.4824 13.5865 25.7428 12.5692 26.0529C12.9558 25.1206 13.315 24.178 13.6667 23.2564C13.9271 22.5742 14.193 21.8773 14.468 21.1894C14.6075 21.4198 14.7531 21.6503 14.9046 21.8814C15.5948 22.9326 16.4624 23.9045 17.4552 24.7459ZM14.8927 14.2326C14.958 15.383 14.7098 16.4897 14.3457 17.5514C13.8972 16.2386 13.6882 14.7889 14.2489 13.6185C14.3927 13.3185 14.5105 13.1581 14.5869 13.0744C14.7049 13.2566 14.8601 13.6642 14.8927 14.2326ZM9.63347 28.8054C9.38148 29.2562 9.12426 29.6782 8.86063 30.0767C8.22442 31.0355 7.18393 32.0621 6.64941 32.0621C6.59681 32.0621 6.53316 32.0536 6.44015 31.9554C6.38028 31.8926 6.37069 31.8476 6.37359 31.7862C6.39161 31.4337 6.85867 30.8059 7.53527 30.2238C8.14939 29.6957 8.84352 29.2262 9.63347 28.8054ZM27.3706 26.1461C27.2889 24.9719 25.3123 24.2186 25.2928 24.2116C24.5287 23.9407 23.6986 23.8091 22.7552 23.8091C21.7453 23.8091 20.6565 23.9552 19.2582 24.2819C18.014 23.3999 16.9392 22.2957 16.1362 21.0733C15.7816 20.5332 15.4628 19.9941 15.1849 19.4675C15.8633 17.8454 16.4742 16.1013 16.3632 14.1479C16.2737 12.5816 15.5674 11.5295 14.6069 11.5295C13.948 11.5295 13.3807 12.0175 12.9194 12.9813C12.0965 14.6987 12.3128 16.8962 13.562 19.5184C13.1121 20.5751 12.6941 21.6706 12.2895 22.7311C11.7861 24.0498 11.2674 25.4103 10.6828 26.7045C9.04334 27.3532 7.69648 28.1399 6.57402 29.1057C5.8387 29.7373 4.95223 30.7028 4.90163 31.7107C4.87693 32.1854 5.03969 32.6207 5.37044 32.9695C5.72183 33.3398 6.16329 33.5348 6.6487 33.5354C8.25189 33.5354 9.79489 31.3327 10.0876 30.8909C10.6767 30.0029 11.2281 29.0124 11.7684 27.8699C13.1292 27.3781 14.5794 27.011 15.985 26.6562L16.4884 26.5283C16.8668 26.4321 17.2601 26.3257 17.6635 26.2153C18.0904 26.0999 18.5296 25.9802 18.976 25.8665C20.4193 26.7844 21.9714 27.3831 23.4851 27.6028C24.7601 27.7883 25.8924 27.6807 26.6589 27.2811C27.3486 26.9219 27.3866 26.3676 27.3706 26.1461ZM30.4755 36.2428C30.4755 38.3932 28.5802 38.5258 28.1978 38.5301H3.74486C1.60224 38.5301 1.47322 36.6218 1.46913 36.2428L1.46884 3.75642C1.46884 1.6039 3.36763 1.4734 3.74457 1.46908H20.263L20.2718 1.4778V7.92396C20.2718 9.21763 21.0539 11.6669 24.0158 11.6669H30.4203L30.4753 11.7218L30.4755 36.2428ZM28.9572 10.1976H24.0169C21.8749 10.1976 21.7453 8.29969 21.7424 7.92417V2.95307L28.9572 10.1976ZM31.9447 36.2428V11.1157L21.7424 0.871022V0.823357H21.6936L20.8742 0H3.74491C2.44954 0 0 0.785336 0 3.75711V36.2435C0 37.5427 0.782956 40 3.74491 40H28.2001C29.4952 39.9997 31.9447 39.2143 31.9447 36.2428Z" fill="#EB5757" />
                </svg>
              ) : file.filename.match(/\.(doc|docx)$/i) ? (
                <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns: xlink="http://www.w3.org/1999/xlink"
                  width="40px" height="40px" viewBox="0 0 548.291 548.291" xml: space="preserve">
                  <g>
                    <path d="M486.201,196.121h-13.166v-63.525c0-0.399-0.062-0.795-0.115-1.2c-0.021-2.522-0.825-5-2.552-6.96L364.657,3.675
		c-0.033-0.031-0.064-0.042-0.085-0.073c-0.63-0.704-1.364-1.292-2.143-1.796c-0.229-0.157-0.461-0.286-0.702-0.419
		c-0.672-0.365-1.387-0.672-2.121-0.893c-0.2-0.052-0.379-0.134-0.577-0.188C358.23,0.118,357.401,0,356.562,0H96.757
		C84.894,0,75.256,9.649,75.256,21.502v174.613H62.092c-16.971,0-30.732,13.756-30.732,30.73v159.81
		c0,16.966,13.761,30.736,30.732,30.736h13.164V526.79c0,11.854,9.638,21.501,21.501,21.501h354.776
		c11.853,0,21.501-9.647,21.501-21.501V417.392h13.166c16.966,0,30.729-13.764,30.729-30.731v-159.81
		C516.93,209.877,503.167,196.121,486.201,196.121z M96.757,21.507h249.054v110.006c0,5.94,4.817,10.751,10.751,10.751h94.972
		v53.861H96.757V21.507z M367.547,335.847c7.843,0,16.547-1.701,21.666-3.759l3.916,20.301c-4.768,2.376-15.509,4.949-29.493,4.949
		c-39.748,0-60.204-24.73-60.204-57.472c0-39.226,27.969-61.055,62.762-61.055c13.465,0,23.705,2.737,28.31,5.119l-5.285,20.64
		c-5.287-2.226-12.615-4.263-21.832-4.263c-20.641,0-36.663,12.444-36.663,38.027C330.718,321.337,344.362,335.847,367.547,335.847z
		 M291.647,296.97c0,37.685-22.854,60.537-56.444,60.537c-34.113,0-54.066-25.759-54.066-58.495
		c0-34.447,21.995-60.206,55.94-60.206C272.39,238.806,291.647,265.248,291.647,296.97z M67.72,355.124V242.221
		c9.552-1.532,21.999-2.375,35.13-2.375c21.83,0,35.981,3.916,47.055,12.276c11.945,8.863,19.455,23.021,19.455,43.311
		c0,21.994-8.017,37.181-19.105,46.556c-12.111,10.058-30.528,14.841-53.045,14.841C83.749,356.825,74.198,355.968,67.72,355.124z
		 M451.534,520.968H96.757V417.392h354.776V520.968z M471.245,355.627l-10.409-20.804c-4.263-8.012-6.992-13.99-10.231-20.636
		h-0.342c-2.388,6.656-5.28,12.624-8.861,20.636l-9.552,20.804h-29.675l33.254-58.158l-32.054-56.786h29.849l10.058,20.984
		c3.413,6.979,5.963,12.614,8.694,19.092h0.335c2.729-7.332,4.955-12.446,7.843-19.092l9.721-20.984h29.683l-32.406,56.103
		l34.105,58.841H471.245z"/>
                    <path d="M141.729,296.277c0.165-23.869-13.814-36.494-36.15-36.494c-5.807,0-9.552,0.514-11.772,1.027v75.2
		c2.226,0.509,5.806,0.509,9.047,0.509C126.388,336.698,141.729,323.743,141.729,296.277z"/>
                    <path d="M208.604,298.493c0,22.515,10.575,38.372,27.969,38.372c17.567,0,27.617-16.703,27.617-39.045
		c0-20.641-9.885-38.377-27.801-38.377C218.827,259.448,208.604,276.162,208.604,298.493z"/>
                  </g>
                </svg>
              ) : (
                <svg width="40px" height="40px" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  <title /><g id="xxx-word"><path class="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,1,1,10,0V95h70a5,5,0,0,1,0,10Z" /><path class="cls-1" d="M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z" /><path class="cls-1" d="M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z" /><path class="cls-1" d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" /><path class="cls-1" d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,1,1,0,10Z" /><path class="cls-1" d="M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30.19-30l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z" /><path class="cls-1" d="M163.16,236H152.85V190.92H138.67v-8.24h38.67v8.24H163.16Z" /><path class="cls-1" d="M222.23,236H211l-11.8-21-12.5,21h-8.95l16.88-27.77-14.49-25.55h11.17l9.84,17.73,10.43-17.73h9L205.74,207Z" /><path class="cls-1" d="M247.15,236H236.84V190.92H222.66v-8.24h38.67v8.24H247.15Z" /></g>
                </svg>
              )}
            </div>
            <div className="file-detail">
              <h6>{file.filename}</h6>
              <p ><span>Size: {file.filesize}</span> <span>   </span><span className="ml-2">Modified: {file.datetime}</span></p>
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

export default MediaUpload;
