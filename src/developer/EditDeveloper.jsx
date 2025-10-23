


import Layout from '../Layout/Layout'
import LeftNavbar from '../Layout/LeftNavbar'
import { API_KEY, API_TOKEN, VITE_TINY_API_KEY } from '../config'
import { toast } from 'react-toastify'
import { useState, useEffect, useContext } from 'react'
import './AddDeveloper.css'
// import { Select, MenuItem, FormControl, InputLabel, TextField, TextareaAutosize, Alert, FormHelperText } from '@mui/material';
import { AuthContext } from '../context/MyStore'
import { post, get } from '../Api/api'


import Select from "react-select";
import { Editor } from "@tinymce/tinymce-react";
// import { MyContext } from "../Store/AuthContext";
import MediaUpload from "../project/media-and-Image-upload/MediaUpload";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BreadCrum2 from "../Layout/BreadCrum2";
import FeaturedImageUpload from "../components/FeaturedImageUpload/FeaturedImageUpload";
import { useNavigate, useParams } from "react-router-dom/dist";
import MediaUploadEdit from "../project/media-and-Image-upload/MediaUploadEdit";
import SearchableDropdown from "../components/searchabledropdown/SearchableDropdown";
import { useDebounce } from '../hook/useDebounce'

const fieldOrder = {
  text: 1,
  textarea: 2,
  select: 3,
  radio: 4,
  texteditor: 5,
  checkbox: 6,
  media: 7,
};


const EditDeveloper = () => {
  const [isOn, setIsOn] = useState(false);
  const [purpose, setPurpose] = useState([]);
  const [property, setProperty] = useState([]);
  const [property_type, setPropertyType] = useState([]);
  const [property_status, setPropertyStatus] = useState([]);
  const [location, setLocation] = useState([]);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({ repeater_fields: [{}] });
  const [keywordForm, setKeywordForm] = useState({ keyword: [] });
  const [fetchedKeyword, setFetchedKeyword] = useState({})

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [sortedCustomFields, setSortedCustomFields] = useState([]);
  const [errors, setErrors] = useState({}); // Error state
  const [error, setError] = useState({}); // Error state

  // keyword

  const [keywords, setKeywords] = useState([]); // array of IDs
  const [keywordObjects, setKeywordObjects] = useState([]); // full keyword objects for display
  const [keywordInput, setKeywordInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentFragment, setCurrentFragment] = useState("");
  const debouncedkeyword = useDebounce(currentFragment, 1000);

  // API call to get or create keyword by name
  const getOrCreateKeyword = async (keyword) => {
    try {
      const res = await get(`/api/get-keyword-by-keyword-type?keyword_type=property_keyword&search=${encodeURIComponent(keyword)}`);
      if (res.data.status && res.data.data.length > 0) {
        return res.data.data[0]; // return first keyword object
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  const fetchKeywords = async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const res = await get(`/api/get-keyword-by-keyword-type?keyword_type=property_keyword&search=${encodeURIComponent(query)}`);
      if (res.data && res.data.data) {
        setSuggestions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeywordInput(value);
    setShowSuggestions(true);
    setCurrentFragment(value.trim());
  };

  const handleKeywordKeyDown = async (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newKeyword = keywordInput.trim();
      if (newKeyword === "") return; // don't add empty

      // Check if keyword name already exists in keywordObjects to avoid duplicate API calls
      let existingKeywordObj = keywordObjects.find(
        (k) => k.keyword_name.toLowerCase() === newKeyword.toLowerCase()
      );

      if (!existingKeywordObj) {
        // call API to get or create keyword
        existingKeywordObj = await getOrCreateKeyword(newKeyword);
        if (!existingKeywordObj) {
          // API error or no keyword returned
          return;
        }

        // Add keyword object to state
        setKeywordObjects((prev) => [...prev, existingKeywordObj]);
      }

      // Add keyword ID if not already added
      if (!keywords.includes(existingKeywordObj.id)) {
        setKeywords((prev) => [...prev, existingKeywordObj.id]);
      }

      // Clear input and suggestions
      setKeywordInput("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // On clicking suggestion, add it similarly
  const handleSuggestionClick = (keywordObj) => {
    if (!keywords.includes(keywordObj.id)) {
      setKeywords(prev => [...prev, keywordObj.id]);
    }
    if (!keywordObjects.find(k => k.id === keywordObj.id)) {
      setKeywordObjects(prev => [...prev, keywordObj]);
    }
    setKeywordInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };


  // Remove keyword by ID
  const removeKeyword = (id) => {
    setKeywords(prev => prev.filter(kid => kid !== id));
    setKeywordObjects(prev => prev.filter(k => k.id !== id));
  };


  useEffect(() => {
    if (debouncedkeyword.length > 0) {
      fetchKeywords(debouncedkeyword);
    } else {
      setSuggestions([]);
    }
  }, [debouncedkeyword]);

  const propertyStatusOptions = property_status?.map((record) => ({
    value: record.id,
    label: record.name,
  }));
  useEffect(() => {
    if (fetchedKeyword && fetchedKeyword.length > 0) {
      setKeywords(fetchedKeyword.map(k => k.id));          // IDs only
      setKeywordObjects(fetchedKeyword.map(k => ({         // map to your expected object keys
        id: k.id,
        keyword_name: k.name  // or just name depending on your UI usage
      })));
    }
  }, [fetchedKeyword]);

  const selectedKeywordObjects = keywordObjects.filter(k => keywords.includes(k.id));


  const [formData2, setFormData2] = useState({
    purpose_id: null,
    property_id: null,
    property_type_id: [],
    property_status_id: null,
    name: "",
    description: "",
    property_address: "",
    video_url: "",
    property_video: "",
    area_locality: '',
    colony: '',
    pin_code: '',
    virtual_tour: null,
    video_thumbnail: "",
    featured_image: "",
    brochure: "",
    location_id: null,
    country_id: null,
    state_id: null,
    city_id: null,
    keyword: [],
    model_fields: [],
    temporary_status: "active",
    featured_img: null,
    live_status: "",
  });


  const [errorMsgProperty, setErrorMsgProperty] = useState("");
  const [errorMsgType, setErrorMsgType] = useState("");
  // const [error, setError] = useState({ property_error: "", property_type: "" });
  const [progress, setProgress] = useState(false);
  const [PurposeData, setPurposeData] = useState([]);
  const [liveData, setLiveData] = useState('')
  const [propertyData, setPropertyData] = useState([]);
  const [propertyTypeData, setPropertyTypeData] = useState([]);
  const [propertyStatusData, setPropertyStatusData] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [keyword, setkeyword] = useState([]);
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const nav = useNavigate()
  const repeaterdata = [...formData.repeater_fields];
  repeaterdata.splice(0, 1);

  // Convert your options for React Select
  const propertyTypeOptions = property_type?.map((record) => ({
    value: record.id,
    label: record.name,
  }));

  console.log(formData2);

  useEffect(() => {
    console.log(id);
    get(`/api/get-data-developer/${id}`)
      .then((response) => {
        // setFormData({
        //   ...formData,
        //  repeater_fields:response.data[0].custom_field_values
        // })
        // console.log(response);
        // const repeaterArray = response.data;
        // console.log(repeaterArray);
        // repeaterArray.forEach((data) => {
        //   data.custom_field_values.forEach((rec) => {
        //     // console.log(rec.custom_field_options)
        //   });
        //   setFormData({
        //     ...formData,
        //     repeater_fields: data.custom_field_values,
        //   });
        // });
        setCustomFields(response.data.repeater_fields);
        const {
          description,
          featured_image,
          brochure,
          property_video,
          video_url,
          virtual_tour,
          location_id,
          property_id,
          property_status_id,
          property_type_id,
          purpose_id,
          name,
          live_status,
          property_type,
          property_status,
          street_address,
          location_name,
          purpose_id_name,
          keyword,
          country_id,
          state_id,
          city_id,
          area_locality,
          colony,
          pin_code,
          id

        } = response.data;
        setFetchedKeyword(keyword)
        setLiveData(response.data.live_status)
        console.log("data", response.data);
        setFormData2({
          ...formData2,
          description,
          featured_image,
          brochure,
          property_video,
          video_url,
          virtual_tour,
          id: id,
          location_id,
          property_id: property_id,
          property_type_id: property_type?.map(val => val.property_type_id) || [],
          property_status_id: property_status?.map(val => val.property_status_id) || [],
          purpose_id,
          name,
          street_address,
          country_id,
          state_id,
          city_id,
          live_status,
          featured_img: featured_image,
          area_locality,
          colony,
          pin_code,

        });
        setoptionName({
          ...optionName,
          property_name: property_name,
          // property_type: property_type_id_name,
          // property_status_name: property_status_id_name,
          location_name: location_name,
          purpose_name: purpose_id_name,
        });

        setKeywordForm({
          keyword: keyword
        })

      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log("data", liveData);
  // Handler for React Select change
  const handlePropertyTypeSelect = (selectedOptions, { name }) => {
    // selectedOptions is an array of selected objects
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    console.log("Selected values:", selectedValues);

    // Update your state using handleChange2
    handleChange2({
      target: { name, value: selectedValues }, // send all selected values
    });
  };

  console.log("live status", formData2.live_status)

  const handleChange = (eOrValue, id, type, fieldName = "field_value") => {
    const isEditor = typeof eOrValue === "string"; // TinyMCE

    const isCustomMediaInput =
      typeof eOrValue === "object" &&
      eOrValue?.target?.files === undefined &&
      eOrValue?.target?.name === fieldName &&
      (type === "media" || type === "file");



    const event = isEditor || isCustomMediaInput ? null : eOrValue;
    const rawValue = isEditor ? eOrValue : event?.target?.value;
    const files = event?.target?.files;
    const checked = event?.target?.checked;
    console.log("test data =>", eOrValue, id, type)
    // ✅ Normalize value based on field type
    const normalizeValue = (type, existingValue) => {
      if (isCustomMediaInput) {
        // MediaUpload sends a mixed array of File & object
        return Array.isArray(eOrValue.target.value)
          ? eOrValue.target.value.filter(Boolean) // remove any undefined/null
          : [];
      }

      if (type === "media" || type === "file") {
        const fileList = Array.from(files || []);
        return fileList;
      }

      if (type === "checkbox") {
        const current = Array.isArray(existingValue) ? existingValue : [];
        return checked
          ? [...current, rawValue]
          : current.filter((v) => v !== rawValue);
      }
      if (type === "radio") {
        // Radios only have one value, so just return the value directly
        return rawValue;
      }

      return rawValue;
    };
    console.log("✅ Final normalized value:", normalizeValue(type, []));

    // ✅ 1. Update sortedCustomFields (UI)
    setSortedCustomFields((prevFields) =>
      prevFields.map((field) => {
        if (field.custom_field_id === id || field.id === id) {
          return {
            ...field,
            [fieldName]: normalizeValue(type, field[fieldName]),
          };
        }
        return field;
      })
    );
    console.log("⏫ Updating sortedCustomFields", id, type);


    // ✅ 2. Update formData.repeater_fields (for submission)
    setFormData((prevState) => {
      const existingIndex = prevState.repeater_fields.findIndex(
        (field) => field.custom_field_id === id || field.id === id
      );

      const updatedRepeaterFields = [...prevState.repeater_fields];
      const newValue = normalizeValue(
        type,
        updatedRepeaterFields[existingIndex]?.field_value
      );

      if (existingIndex !== -1) {
        updatedRepeaterFields[existingIndex] = {
          ...updatedRepeaterFields[existingIndex],
          field_value: newValue,
        };
      } else {
        updatedRepeaterFields.push({
          custom_field_id: id,
          field_type: type,
          field_value: newValue,
        });
      }

      return {
        ...prevState,
        repeater_fields: updatedRepeaterFields,
      };
    });

    // ✅ 3. Clear errors
    if (errors[id]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[id];
        return newErrors;
      });
    }
  };



  // to handle repeater fields
  const handleChangeRepeater = (
    e,
    parentId,
    subFieldId,
    type,
    groupIndex,
    name = "field_value",

  ) => {
    const { value, files, checked } = e.target;

    console.log("➡️ ChangeRepeater", { files });

    let finalValue;
    if (type === "media") {
      finalValue = Array.from(files || []);
    } else {
      finalValue = value;
    }

    const updateFieldValue = (fieldArray = []) => {
      const updatedField = [...fieldArray];
      const fieldIndex = updatedField.findIndex((f) => f.sub_field_id === subFieldId);

      if (type === "checkbox") {
        const prev = fieldIndex !== -1 ? updatedField[fieldIndex]?.[name] || [] : [];
        finalValue = checked
          ? [...prev, value]
          : prev.filter((v) => v !== value);
      }

      if (fieldIndex !== -1) {
        updatedField[fieldIndex] = {
          ...updatedField[fieldIndex],
          [name]: finalValue,
        };
      } else {
        updatedField.push({
          sub_field_id: subFieldId,
          field_type: type,
          [name]: finalValue,
          options: [],
        });
      }

      return updatedField;
    };

    // ✅ 1. Update UI state: sortedCustomFields
    setSortedCustomFields((prevFields) =>
      prevFields.map((field) => {
        const idMatch = field.custom_field_id || field.id;
        if (idMatch !== parentId) return field; // 🛑 FIXED condition

        let groups = [];

        if (Array.isArray(field.field_value)) {
          groups = [...field.field_value];
        } else {
          console.warn("Broken field_value structure detected. Resetting.");
          groups = [[]];
        }
        groups[groupIndex] = updateFieldValue(groups[groupIndex] || []);

        return {
          ...field,
          field_value: groups,
        };
      })
    );

    // ✅ 2. Update submission state: formData.repeater_fields
    setFormData((prev) => {
      const updatedRepeaterFields = [...prev.repeater_fields];
      const parentIndex = updatedRepeaterFields.findIndex(
        (f) => f.custom_field_id === parentId
      );

      if (parentIndex === -1) return prev;

      const updatedParent = { ...updatedRepeaterFields[parentIndex] };

      let groups = [];

      if (Array.isArray(updatedParent.field_value)) {
        groups = [...updatedParent.field_value];
      } else {
        console.warn("Broken formData.field_value structure detected. Resetting.");
        groups = [[]];
      }

      groups[groupIndex] = updateFieldValue(groups[groupIndex] || []);

      updatedParent.field_value = groups;
      updatedRepeaterFields[parentIndex] = updatedParent;

      return {
        ...prev,
        repeater_fields: updatedRepeaterFields,
      };
    });
  };


  // to handle condition model fields
  useEffect(() => {
    const fields = [
      { key: "purpose_id", model: "purpose" },
      { key: "property_id", model: "property" },
      { key: "property_status_id", model: "property_status", isMulti: true },
      { key: "property_type_id", model: "property_type", isMulti: true }, // multi-select
    ];

    setFormData2((prevData) => {
      const updatedModelFields = Array.isArray(prevData.model_fields)
        ? [...prevData.model_fields]
        : [];

      fields.forEach(({ key, model, isMulti }) => {
        const value = prevData[key];
        if (value && (isMulti ? value.length > 0 : true)) {
          const existingIndex = updatedModelFields.findIndex(
            (field) => field.model === model
          );

          const conditionValue = isMulti
            ? Array.isArray(value)
              ? value.map((v) => (typeof v === "object" ? v.value : v))
              : [] // fallback if value is not array
            : [value]; // wrap single value in array


          if (existingIndex !== -1) {
            updatedModelFields[existingIndex] = {
              ...updatedModelFields[existingIndex],
              condition: conditionValue,
            };
          } else {
            updatedModelFields.push({
              model,
              condition: conditionValue,
            });
          }
        }
      });

      return {
        ...prevData,
        model_fields: updatedModelFields,
      };
    });
  }, [
    formData2.purpose_id,
    formData2.property_id,
    formData2.property_type_id,
    formData2.property_status_id,
  ]);

  const handleTextEditor = (
    content,
    parentId,
    subFieldId,
    type = "texteditor",
    name = "field_value",
    groupIndex
  ) => {
    const updateFieldValue = (fieldArray = []) => {

      const updatedField = [...fieldArray];
      const fieldIndex = updatedField.findIndex((f) => f.sub_field_id === subFieldId);
      console.log("check==>", subFieldId)
      if (fieldIndex !== -1) {
        updatedField[fieldIndex] = {
          ...updatedField[fieldIndex],
          [name]: content,
        };
      } else {
        updatedField.push({
          sub_field_id: subFieldId,
          field_type: type,
          [name]: content,
          options: [],
        });
      }

      return updatedField;
    };

    // ✅ 1. Update UI state: sortedCustomFields
    setSortedCustomFields((prevFields) =>
      prevFields.map((field) => {
        const idMatch = field.custom_field_id || field.id;
        if (idMatch !== parentId) return field;

        console.log("checkon===>", field.field_value)

        let groups = [];

        if (Array.isArray(field.field_value)) {
          groups = [...field.field_value];
        } else {
          console.warn("Broken field_value in UI state. Resetting.");
          groups = [[]];
        }
        console.log("check on", groupIndex)
        groups[groupIndex] = updateFieldValue(groups[groupIndex] || []);


        return {
          ...field,
          field_value: groups,
        };
      })
    );

    // ✅ 2. Update submit state: formData.repeater_fields
    setFormData((prev) => {
      const updatedRepeaterFields = [...prev.repeater_fields];
      const parentIndex = updatedRepeaterFields.findIndex(
        (f) => f.custom_field_id === parentId
      );

      if (parentIndex === -1) return prev;

      const updatedParent = { ...updatedRepeaterFields[parentIndex] };

      let groups = [];

      if (Array.isArray(updatedParent.field_value)) {
        groups = [...updatedParent.field_value];
      } else {
        console.warn("Broken field_value in submit state. Resetting.");
        groups = [[]];
      }

      groups[groupIndex] = updateFieldValue(groups[groupIndex] || []);

      updatedParent.field_value = groups;
      updatedRepeaterFields[parentIndex] = updatedParent;

      return {
        ...prev,
        repeater_fields: updatedRepeaterFields,
      };
    });

    // ✅ 3. Clear any existing errors
    if (errors[parentId]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[parentId];
        return newErrors;
      });
    }
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;

    console.log("name", name)

    // Determine the model name based on the field name
    const modelName =
      name === "purpose_id"
        ? "purpose"
        : name === "property_id"
          ? "property"
          : name === "property_status_id"
            ? "property_status"
            : name === "property_type_id"
              ? "property_type"
              : null;

    setFormData2((prevData) => {
      let updatedModelFields = [...prevData.model_fields];

      // Only add/update model_fields if the field name matches one of the specified models
      if (modelName) {
        const existingIndex = updatedModelFields.findIndex(
          (field) => field.model === modelName
        );

        if (existingIndex !== -1) {
          // Update the existing model field condition
          updatedModelFields[existingIndex].condition = [value];
        } else {
          // Add a new model field entry
          updatedModelFields.push({
            model: modelName,
            condition: [value],
          });
        }
      }

      return {
        ...prevData,
        [name]: value,
        ...(modelName && { model_fields: updatedModelFields }), // Only update model_fields if a modelName exists
      };
    });
  };

  // const handleChange2 = (e) => {

  //   setFormData2({
  //     ...formData2,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleEditorChange = (content, editor) => {
    setFormData2({
      ...formData2,
      description: content, // Update formData directly with the editor content
    });
  };

  const checkvalidate = (e) => {
    if (e.target.name === "property_type_id") {
      if (formData2.property_id === null) {
        setErrorMsgProperty("Please select property first");
      } else {
        setErrorMsgProperty("");
      }
    }
    if (e.target.name === "property_status_id") {
      if (formData2.property_type_id === null) {
        setErrorMsgType("Please select property type first");
      } else {
        setErrorMsgType("");
      }
    }
  };

  let fetchPurpose = () => {
    get(`/api/condition-listing?model=purpose`)
      .then((response) => {
        setPurpose(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let fetchProperty = () => {
    get(`/api/condition-listing?model=property`)
      .then((response) => {
        // console.log(response.data.data)
        setProperty(response.data.data);

        setPropertyStatus([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let fetchLocation = () => {
    get(`/api/location-listing`)
      .then((response) => {
        setLocation(response.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log("submit data ---", customFields);
  const submitData = {
    ...formData2,
    repeater_fields: sortedCustomFields, // Assuming repeaterdata is the correct array of repeater fields
  };

  console.log("submitted data ==>", submitData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    // Validate main form fields

    if (formData2.property_type_id === null) {
      newErrors.property_type = "**Please select property type**";
    }
    if (formData2.purpose_id === null) {
      newErrors.purpose_error = "**Please select purpose**";
    }
    if (formData2.property_id === null) {
      newErrors.property_error = "**Please select property**";
    }
    if (formData2.property_status_id === null) {
      newErrors.property_status_error = "**Please select property status**";
    }

    if (!formData2.country_id) {
      newErrors.country_error = "**Please select country**";
    }
    if (!formData2.state_id) {
      newErrors.state_error = "**Please select state**";
    }
    if (!formData2.city_id) {
      newErrors.city_error = "**Please select city**";
    }

    console.log("submit newww ---", submitData);
    submitData.repeater_fields.forEach((field) => {
      if (field.required === "yes") {
        let isFieldPresent = false;

        if (field.field_type === "repeater") {
          // field_value = array of groups -> each group is an array of subfields
          isFieldPresent =
            Array.isArray(field.field_value) &&
            field.field_value.length > 0 &&
            field.field_value.every((group) =>
              Array.isArray(group) &&
              group.every((item) => {
                // Check if required subfield has a non-empty value
                return (
                  item &&
                  item.field_value !== null &&
                  item.field_value !== undefined &&
                  String(item.field_value).trim() !== ""
                );
              })
            );
        }

        else {
          // Normal input: text, textarea, select, etc.
          const value = field.field_value;
          isFieldPresent =
            value !== null &&
            value !== undefined &&
            (Array.isArray(value) ? value.length > 0 : String(value).trim() !== "");
        }

        if (!isFieldPresent) {
          newErrors[field.id] = `${field.field_label} is required`;
          console.log(newErrors[field.id])
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Store the errors to show in UI
      return; // 🚫 Stop form submission
    }
    try {
      setProgress(true);
      const formData = new FormData();

      // Append main form fields
      formData.append("purpose_id", formData2.purpose_id);
      formData.append("property_id", formData2.property_id);
      // For property_type_id
      formData2.property_type_id?.forEach((val, index) => {
        formData.append(`property_type_id[${index}]`, val);
      });

      // For property_status_id
      formData2.property_status_id?.forEach((val, index) => {
        formData.append(`property_status_id[${index}]`, val);
      });

      formData.append("country_id", formData2.country_id);
      formData.append("state_id", formData2.state_id);
      formData.append("city_id", formData2.city_id);
      formData.append("pin_code", formData2.pin_code);
      formData.append("area_locality", formData2.area_locality);
      formData.append("colony", formData2.colony);
      formData.append("keyword", keywords);
      formData.append("name", formData2.name);
      formData.append("id", formData2.id)
      formData.append("description", formData2.description);
      formData.append("street_address", formData2.street_address || "");
      formData.append("temporary_status", formData2.temporary_status);
      formData.append("live_status", formData2.live_status)
      formData.append("featured_image", formData2.featured_img)

      // Append repeater fields
      const appendRepeaterFields = async (formData, fields) => {
        for (const [index, field] of fields.entries()) {
          const baseKey = `repeater_fields[${index}]`;

          formData.append(`${baseKey}[custom_field_id]`, field.custom_field_id);
          formData.append(`${baseKey}[field_type]`, field.field_type);

          // 🔁 Handle Repeater Fields
          if (field.field_type === "repeater" && Array.isArray(field.field_value)) {
            for (const [groupIndex, group] of field.field_value.entries()) {
              if (!Array.isArray(group)) continue;

              for (const [nestedIndex, nestedField] of group.entries()) {
                const nestedKey = `${baseKey}[field_value][${groupIndex}][${nestedIndex}]`;
                const fieldValue = nestedField.field_value;

                // Basic metadata
                formData.append(`${nestedKey}[sub_field_id]`, nestedField.id || nestedField.sub_field_id);
                formData.append(`${nestedKey}[field_type]`, nestedField.field_type);

                if (
                  Array.isArray(fieldValue) &&
                  (nestedField.field_type === "media" || nestedField.field_type === "file")
                ) {
                  // 🟡 Handle media/file type
                  const existingFileNames = [];

                  for (const file of fieldValue) {
                    if (file instanceof File) {
                      // New file – append to FormData
                      formData.append(`${nestedKey}[field_value][]`, file);
                    } else if (typeof file === "string") {
                      // Remote URL – extract filename
                      existingFileNames.push(file.split("/").pop());
                    } else if (typeof file === "object" && file.file_name) {
                      existingFileNames.push(file.file_name);
                    }
                  }

                  // Append remote file names if any
                  if (existingFileNames.length > 0) {
                    formData.append(`${nestedKey}[existing_value]`, JSON.stringify(existingFileNames));
                  }
                } else if (Array.isArray(fieldValue)) {
                  // 🟢 Handle other array fields (e.g. checkbox, multi-select)
                  formData.append(`${nestedKey}[field_value]`, fieldValue.join(","));
                } else {
                  // 🔵 For string/number fields, if ever needed
                  formData.append(`${nestedKey}[field_value]`, fieldValue || "");
                }
              }
            }
          }
          // 🟢 Non-repeater fields
          else {
            const value = field.field_value;
            const existingVal = field.existing_value;

            if (
              (field.field_type === "media" || field.field_type === "file") &&
              Array.isArray(existingVal) && existingVal.length > 0
            ) {
              const fileNames = value.map((item) => {
                if (typeof item === "string") return item.split("/").pop();
                if (typeof item === "object" && item.file_name) return item.file_name;
                return null;
              }).filter(Boolean);

              formData.append(`${baseKey}[existing_value]`, JSON.stringify(fileNames));
            }

            if (Array.isArray(value)) {
              if (field.field_type === "media" || field.field_type === "file") {
                for (const file of value) {
                  if (file instanceof File) {
                    formData.append(`${baseKey}[field_value][]`, file);
                  }
                }
              } else {
                formData.append(`${baseKey}[field_value]`, value.join(","));
              }
            } else {
              if (
                (field.field_type === "media" || field.field_type === "file") &&
                typeof value === "object" &&
                value?.file_name
              ) {
                formData.append(`${baseKey}[field_value]`, value.file_name);
              } else if (typeof value === "string") {
                formData.append(`${baseKey}[field_value]`, value);
              }
            }
          }
        }
      };

      appendRepeaterFields(formData, submitData.repeater_fields || []);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = post(
        `/api/edit-developer-listing`,
        formData
      );

      setProgress(false);
      toast.success("Data Inserted Successfully!");
      nav('/my-account/all-developer')
    } catch (error) {
      setProgress(false);
      toast.error("Error occurred while submitting data");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchPurpose();
    fetchProperty();
  }, []);
  useEffect(() => {
    // Fetch countries when component mounts
    const fetchCountries = async () => {
      try {

        const response = await get("/api/countries");
        console.log(response.data);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    // Fetch states when country changes
    const fetchStates = async () => {
      if (formData2.country_id) {
        try {

          const response = await get(
            `/api/states/${formData2.country_id}`
          );
          setStates(response.data);
          // Reset state and city when country changes
          setCities([]);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      }
    };
    fetchStates();
  }, [formData2.country_id]);

  useEffect(() => {
    // Fetch cities when state changes
    const fetchCities = async () => {
      if (formData2.state_id) {
        try {

          const response = await get(
            `/api/cities/${formData2.state_id}`
          );
          console.log("citiess", response);
          setCities(response.data);
          // Reset city when state changes

        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    };
    fetchCities();
  }, [formData2.state_id]);

  useEffect(() => {
    if (formData2.property_id) {
      // Check if property_id exists before making the API call
      get(
        `/api/property-type-listing-by-propertyid?property_id=${formData2.property_id}`
      )
        .then((response) => {
          setPropertyType(response.data.data);
        })
        .catch((err) => {
          console.log(err);
          // setPropertyType([]);
        });
    }
  }, [formData2.property_id]);

  useEffect(() => {
    if (formData2.property_type_id) {
      // Check if property_id exists before making the API call
      get(
        `/api/property-status-listing-by-propertytype?property_type_id=${formData2.property_type_id[0]}`
      )
        .then((response) => {
          // console.log(response.data.data);
          setPropertyStatus(response.data.data);
        })
        .catch((err) => {
          console.log(err);
          // setPropertyType([]);
        });
    }
  }, [formData2.property_type_id]);

  // code for amenities start here..
  useEffect(() => {
    get(`/api/get-amenities-data`)
      .then((response) => {
        // console.log(response.data);
        setAmenities(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

 

  // code for purpose repeater
  useEffect(() => {
    const fetchPurposeId = async () => {
      try {
        const response = await post(
          `/api/custom-field-listing-by-model-conditionid`,
          {
            model_fields: formData2.model_fields,
            post_type: "developer_list",
          }
        );

        const newData = response.data?.data || [];
        console.log("✅ API Fetched Fields:", newData);

        // Update the fields
        setCustomFields((prevFields) => {
          const updatedFields = newData.map((newItem) => {
            const oldItem = prevFields.find(
              (old) =>
                old.custom_field_id === newItem.id || old.id === newItem.id
            );

            // 🔁 Repeater field handling
            if (newItem.field_type === "repeater") {
              const templateFields = Array.isArray(newItem.field_value)
                ? [...newItem.field_value]
                : [];

              const oldGroups = Array.isArray(oldItem?.field_value)
                ? oldItem.field_value
                : [];

              // If no old groups exist (new repeater), initialize empty fields
              const enrichedGroups =
                oldGroups.length > 0
                  ? oldGroups.map((group) =>
                    Array.isArray(group)
                      ? group.map((oldField) => {
                        const meta = templateFields.find(
                          (tmpl) => tmpl.id === oldField.sub_field_id
                        );
                        return {
                          ...meta,
                          sub_field_id: oldField.sub_field_id,
                          field_type: oldField.field_type,
                          field_value:
                            oldField.field_value !== null &&
                              oldField.field_value !== undefined &&
                              String(oldField.field_value).toLowerCase() !== "null"
                              ? oldField.field_value
                              : "",
                          options: oldField.options || [],
                        };
                      })
                      : []
                  )
                  : [
                    templateFields.map((tmpl) => ({
                      ...tmpl,
                      sub_field_id: tmpl.id,
                      field_value: "",
                    })),
                  ];

              return {
                ...newItem,
                custom_field_id: newItem.id,
                field_value: enrichedGroups,
              };
            }

            // 🟢 Normal field (media, file, text, etc.)
            return {
              ...newItem,
              custom_field_id: newItem.id,
              field_value:
                oldItem?.field_value != null
                  ? oldItem.field_value
                  : newItem.field_value != null
                    ? newItem.field_value
                    : "",
              ...(oldItem?.existing_value != null && {
                existing_value: oldItem.existing_value,
              }),
            };
          });

          console.log("Final custom fields:", updatedFields);
          return updatedFields;
        });

      } catch (err) {
        console.error("Error fetching custom fields:", err);
      }
    };

    fetchPurposeId();
  }, [formData2.purpose_id, formData2.model_fields]);

  // code for property repeater
  // useEffect(() => {
  //   let fetchPurposeId = async () => {
  //     await post(
  //       `/api/custom-field-listing-by-model-conditionid`,
  //       { model_fields: formData2.model_fields, post_type: "project" },

  //     )
  //       .then((response) => {
  //         console.log("property response", response);
  //         setCustomFields((prevFields) => {
  //           const updatedFields = newData.map((newItem) => {
  //             const oldItem = prevFields.find(
  //               (old) =>
  //                 old.custom_field_id === newItem.id || old.id === newItem.id
  //             );

  //             // 🔁 Handle repeater fields
  //             if (newItem.field_type === "repeater") {
  //               const templateFields = Array.isArray(newItem.field_value)
  //                 ? [...newItem.field_value]
  //                 : [];

  //               const oldGroups = Array.isArray(oldItem?.field_value)
  //                 ? oldItem.field_value
  //                 : [];

  //               const enrichedGroups = oldGroups.map((group) =>
  //                 Array.isArray(group) && group.map((oldField) => {
  //                   const meta = templateFields.find(
  //                     (tmpl) => tmpl.id === oldField.sub_field_id
  //                   );

  //                   return {
  //                     ...meta, // All metadata from backend
  //                     sub_field_id: oldField.sub_field_id,
  //                     field_type: oldField.field_type,
  //                     field_value: oldField.field_value,
  //                     options: oldField.options || [],
  //                   };
  //                 })
  //               );

  //               return {
  //                 ...newItem,
  //                 custom_field_id: newItem.id,
  //                 field_value: enrichedGroups,
  //               };
  //             }

  //             // 🟢 For normal fields
  //             return {
  //               ...newItem,
  //               custom_field_id: newItem.id,
  //               field_value: oldItem?.field_value ?? newItem.field_value,
  //             };
  //           });

  //           return updatedFields;
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };
  //   fetchPurposeId();
  // }, [formData2.property_id]);

  //code for property type repeater
  // useEffect(() => {
  //   let fetchPurposeId = async () => {
  //     await post(
  //       `/api/custom-field-listing-by-model-conditionid`,
  //       { model_fields: formData2.model_fields, post_type: "project" },

  //     )
  //       .then((response) => {
  //         console.log("---> type response", response);
  //         setCustomFields((prevFields) => {
  //           const updatedFields = newData.map((newItem) => {
  //             const oldItem = prevFields.find(
  //               (old) =>
  //                 old.custom_field_id === newItem.id || old.id === newItem.id
  //             );

  //             // 🔁 Handle repeater fields
  //             if (newItem.field_type === "repeater") {
  //               const templateFields = Array.isArray(newItem.field_value)
  //                 ? [...newItem.field_value]
  //                 : [];

  //               const oldGroups = Array.isArray(oldItem?.field_value)
  //                 ? oldItem.field_value
  //                 : [];

  //               const enrichedGroups = oldGroups.map((group) =>
  //                 Array.isArray(group) && group.map((oldField) => {
  //                   const meta = templateFields.find(
  //                     (tmpl) => tmpl.id === oldField.sub_field_id
  //                   );

  //                   return {
  //                     ...meta, // All metadata from backend
  //                     sub_field_id: oldField.sub_field_id,
  //                     field_type: oldField.field_type,
  //                     field_value: oldField.field_value,
  //                     options: oldField.options || [],
  //                   };
  //                 })
  //               );

  //               return {
  //                 ...newItem,
  //                 custom_field_id: newItem.id,
  //                 field_value: enrichedGroups,
  //               };
  //             }

  //             // 🟢 For normal fields
  //             return {
  //               ...newItem,
  //               custom_field_id: newItem.id,
  //               field_value: oldItem?.field_value ?? newItem.field_value,
  //             };
  //           });

  //           return updatedFields;
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };
  //   fetchPurposeId();
  // }, [formData2.property_type_id]);

  //code for  property status repeater
  // useEffect(() => {
  //   let fetchPurposeId = async () => {
  //     await post(
  //       `/api/custom-field-listing-by-model-conditionid`,
  //       { model_fields: formData2.model_fields, post_type: "project" },

  //     )
  //       .then((response) => {
  //         console.log("property status response", response);
  //         setPropertyStatusData(response.data.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };
  //   fetchPurposeId();
  // }, [formData2.property_status_id]);

  // code for keyword start here

  // useEffect(() => {
  //   get(`/api/fetch-keywords`)
  //     .then((response) => {
  //       console.log(response.data.data);
  //       setkeyword(response.data.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);


  useEffect(() => {
    const sortedFields = [...customFields].sort(
      (a, b) =>
        (fieldOrder[a.field_type] || 99) - (fieldOrder[b.field_type] || 99)
    );
    console.log("sortedFields", sortedFields);
    setSortedCustomFields(sortedFields);
  }, [customFields, formData2.model_fields]);

  const handleAddRepeater = (parentIndex, record) => {
    setSortedCustomFields((prevFields) => {
      const updatedFields = [...prevFields];
      const parentRepeater = { ...updatedFields[parentIndex] };

      // Ensure existing groups structure
      const existingGroups = Array.isArray(parentRepeater.field_value)
        ? [...parentRepeater.field_value]
        : [];

      // Use first group as a template
      const baseGroup = Array.isArray(existingGroups[0])
        ? existingGroups[0]
        : [];

      // Create new group from base, clearing field_value
      const newGroup = baseGroup.map((field) => ({
        ...field,
        // unique ID
        field_value: "", // reset value
      }));

      parentRepeater.field_value = [...existingGroups, newGroup];
      updatedFields[parentIndex] = parentRepeater;

      return updatedFields;
    });

    // Sync to formData.repeater_fields
    setFormData((prevForm) => {
      const updatedRepeaterFields = [...prevForm.repeater_fields];
      const parentFormIndex = updatedRepeaterFields.findIndex(
        (f) => f.custom_field_id === record.custom_field_id
      );

      if (parentFormIndex !== -1) {
        const parent = { ...updatedRepeaterFields[parentFormIndex] };
        const existingGroups = Array.isArray(parent.field_value)
          ? [...parent.field_value]
          : [];

        const baseGroup = Array.isArray(existingGroups[0])
          ? existingGroups[0]
          : [];

        const newGroup = baseGroup.map((field) => ({
          ...field,
          sub_field_id: Date.now() + Math.floor(Math.random() * 1000),
          field_value: "",
        }));

        parent.field_value = [...existingGroups, newGroup];
        updatedRepeaterFields[parentFormIndex] = parent;

        return {
          ...prevForm,
          repeater_fields: updatedRepeaterFields,
        };
      }

      // If no parent exists
      return prevForm;
    });
  };


  const handleRemoveRepeater = (parentId) => {
    // 1. Update UI (sortedCustomFields)
    setSortedCustomFields((prevFields) =>
      prevFields.map((field) => {
        if (field.id === parentId && field.field_type === "repeater") {
          const updatedGroups = [...field.field_value];
          if (updatedGroups.length > 1) {
            updatedGroups.pop();
          }// remove last group

          return {
            ...field,
            field_value: updatedGroups,
          };
        }
        return field;
      })
    );

    // 2. Update formData (repeater_fields)
    setFormData((prevForm) => {
      const updatedRepeaterFields = [...prevForm.repeater_fields];
      const repeaterIndex = updatedRepeaterFields.findIndex(
        (f) => f.custom_field_id === parentId
      );

      if (repeaterIndex !== -1) {
        const groups = [...updatedRepeaterFields[repeaterIndex].field_value];
        groups.pop(); // remove last group
        updatedRepeaterFields[repeaterIndex].field_value = groups;

        return {
          ...prevForm,
          repeater_fields: updatedRepeaterFields,
        };
      }

      return prevForm;
    });
  };
  useEffect(() => {
    if (fetchedKeyword && fetchedKeyword.length > 0) {
      setKeywords(fetchedKeyword.map(k => k.id));          // IDs only
      setKeywordObjects(fetchedKeyword.map(k => ({         // map to your expected object keys
        id: k.id,
        keyword_name: k.name  // or just name depending on your UI usage
      })));
    }
  }, [fetchedKeyword]);


  const handleStatusChange = (value) => {
    setFormData2((prevData) => ({
      ...prevData,
      temporary_status: value,
    }));
  };
  const handleLiveStatusChange = (value) => {
    setFormData2((prevData) => ({
      ...prevData,
      live_status: value,
    }));
  };
  const handleChangeDeveloper = (e) => {
    const { name, value } = e.target;

    setFormData2((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="-Db-main-div">
      <div style={{ width: '180px' }}>
        <BreadCrum2 tab="Listing" />
      </div>
      <div className=" add-property-listing-search-wraper">
        <div className=" add-property-form-wraper">
          <div className="add-property-form-h-wraper">
            <h1 className="m-0">Edit Developer Listing</h1>
          </div>
          {
            // form start here
          }
          <form className="add-form-listing-wraper" onSubmit={handleSubmit}>
            <div className="row">

              <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                <label>Purpose </label>
                <div className="custom-select">
                  <select
                    name="purpose_id"
                    value={formData2.purpose_id}
                    onChange={handleChange2}
                  >
                    <option selected disabled>
                      Select Purpose
                    </option>
                    {purpose.map((record, i) => (
                      <option key={i} value={record.id}>
                        {record.name}
                      </option>
                    ))}
                  </select>
                  {errors.purpose_error && (
                    <p className="errors-msg">{errors.purpose_error}</p>
                  )}
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                <label>Property </label>
                <div className="custom-select">
                  <select value={formData2.property_id} name="property_id" onChange={handleChange2}>
                    <option selected disabled>
                      Select Property
                    </option>
                    {property.map((record, i) => (
                      <option key={i} value={record.id}>
                        {record.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.property_error && (
                  <p className="errors-msg">{errors.property_error}</p>
                )}
              </div>

              <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                <label>Property Types</label>
                <div className="custom-select">
                  <Select
                    options={propertyTypeOptions}
                    isMulti
                    name="property_type_id"
                    onChange={handlePropertyTypeSelect}
                    placeholder="Select Property Types"
                    value={propertyTypeOptions.filter((option) =>
                      formData2.property_type_id?.includes(option.value)
                    )}

                    styles={{
                      control: (base) => ({
                        ...base,
                        border: "1px solid var(--gray)",
                        outline: "none",
                        background: "transparent",
                        borderRadius: '12px',
                        width: "100%",
                        cursor: "pointer",
                        padding: "0",
                        fontSize: "14px",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        marginTop: "7px",
                        boxShadow: "none",
                        minHeight: "38.6px",
                      })
                    }}
                  />

                  {errorMsgProperty && (
                    <p className="text-danger">{errorMsgProperty}</p>
                  )}
                  {errors.property_type && (
                    <p className="errors-msg">{errors.property_type}</p>
                  )}
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                <label>Property Status </label>
                <div className="custom-select">
                  <Select
                    options={propertyStatusOptions}
                    isMulti
                    name="property_status_id"
                    onChange={handlePropertyTypeSelect}
                    placeholder="Select Status "
                    value={
                      Array.isArray(propertyStatusOptions)
                        ? propertyStatusOptions.filter((option) =>
                          formData2.property_status_id?.includes(option.value)
                        )
                        : []
                    }

                    styles={{
                      control: (base) => ({
                        ...base,
                        border: "1px solid var(--gray)",
                        outline: "none",
                        background: "transparent",
                        borderRadius: '12px',
                        width: "100%",
                        cursor: "pointer",
                        padding: "0",
                        fontSize: "14px",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        marginTop: "7px",
                        boxShadow: "none",
                        minHeight: "38.6px",
                      }),
                    }}
                  />
                  {/* <select
                    name="property_status_id"
                    onChange={handleChange2}
                    onClick={checkvalidate}
                    value={formData2.property_status_id}
                  >
                    <option selected disabled>
                      Select Property Status
                    </option>
                    {property_status &&
                      property_status.map((record, i) => (
                        <option key={i} value={record.id}>
                          {record.name}
                        </option>
                      ))}
                  </select> */}
                  {errors.property_status_error && (
                    <p className="errors-msg">{errors.property_status_error}</p>
                  )}
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                <label>Country </label>
                <Select
                  name="country_id"
                  options={countries.map((country) => ({
                    value: country.id,
                    label: country.name,
                  }))}
                  value={
                    countries.find(
                      (country) => country.id === formData2.country_id
                    )
                      ? {
                        value: formData2.country_id,
                        label: countries.find(
                          (country) => country.id === formData2.country_id
                        ).name,
                      }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData2((prev) => ({
                      ...prev,
                      country_id: selectedOption ? selectedOption.value : "", // Store only the ID
                    }))
                  }
                  placeholder="Search Country"
                  isClearable
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "1px solid var(--gray)",
                      outline: "none",
                      background: "transparent",
                      borderRadius: '12px',
                      width: "100%",
                      cursor: "pointer",
                      padding: "0",
                      fontSize: "14px",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      marginTop: "7px",
                      boxShadow: "none",
                      minHeight: "38.6px",
                    }),
                  }}
                />
                {errors.country_error && (
                  <p className="errors-msg">{errors.country_error}</p>
                )}
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                <label>State </label>

                <Select
                  name="state_id"
                  options={states.map((state) => ({
                    value: state.id,
                    label: state.name,
                  }))}
                  value={
                    states.find((state) => state.id === formData2.state_id)
                      ? {
                        value: formData2.state_id,
                        label: states.find(
                          (state) => state.id === formData2.state_id
                        ).name,
                      }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData2((prev) => ({
                      ...prev,
                      state_id: selectedOption ? selectedOption.value : "", // Store only the ID
                    }))
                  }
                  placeholder="Search State"
                  isClearable
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "1px solid var(--gray)",
                      outline: "none",
                      background: "transparent",
                      borderRadius: '12px',
                      width: "100%",
                      cursor: "pointer",
                      padding: "0",
                      fontSize: "14px",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      marginTop: "7px",
                      boxShadow: "none",
                      minHeight: "38.6px",
                    }),
                  }}
                />
                <p className="errors-msg">{errors.state_error}</p>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                <label>City </label>
                <Select
                  name="city_id"
                  options={cities.map((city) => ({
                    value: city.id,
                    label: city.name,
                  }))}
                  value={
                    cities.find((city) => city.id === formData2.city_id)
                      ? {
                        value: formData2.city_id,
                        label: cities.find(
                          (city) => city.id === formData2.city_id
                        ).name,
                      }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData2((prev) => ({
                      ...prev,
                      city_id: selectedOption ? selectedOption.value : "", // Store only the ID
                    }))
                  }
                  placeholder="Search City"
                  isClearable
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "1px solid var(--gray)",
                      outline: "none",
                      background: "transparent",
                      borderRadius: '12px',
                      width: "100%",
                      cursor: "pointer",
                      padding: "0",
                      fontSize: "14px",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      marginTop: "7px",
                      boxShadow: "none",
                      minHeight: "38.6px",
                    }),
                  }}
                />
                <p className="errors-msg">{errors.city_error}</p>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                <div className="custom-select">
                  <label>Area/Locality</label>
                  <input
                    type="text"
                    name="area_locality"
                    value={formData2.area_locality}
                    onChange={handleChange2}
                    placeholder="Enter Area/Locality"
                  />
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                <div className="custom-select">
                  <label>Colony</label>
                  <input
                    type="text"
                    name="colony"
                    value={formData2.colony}
                    onChange={handleChange2}
                    placeholder="Enter colony"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                <div className="custom-select">
                  <label>PIN Code</label>
                  <input
                    type="tel"
                    name="pin_code"
                    value={formData2.pin_code}
                    onChange={handleChange2}
                    placeholder="Enter PIN code"
                  />
                </div>
              </div>



         
              <div className="col-lg-12 col-md-12 col-sm-12 add-listing-form-col">
                <div className="custom-select">
                  <label>Street Address</label>
                  <textarea
                    type="text"
                    name="street_address"
                    value={formData2.street_address}
                    onChange={handleChange2}
                    placeholder="Enter Street Address"
                  />
                </div>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 add-listing-form-col">
                <div className="custom-select">
                  <label>Keywords</label>
                  <div
                    style={{
                      position: "relative",
                      border: "1px solid var(--gray)",
                      padding: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      minHeight: "46px",
                      alignItems: "center",
                      marginTop: "7px"
                    }}
                  >
                    {/* Display keyword chips with names */}
                    {selectedKeywordObjects.map((kw) => (
                      <span
                        key={kw.id}
                        style={{
                          background: "#e6f0ff",
                          padding: "4px 8px",
                          borderRadius: "20px",
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: "13px",
                          color: "#333",
                        }}
                      >
                        {kw.keyword_name}
                        <span
                          onClick={() => removeKeyword(kw.id)} // remove by id
                          style={{
                            marginLeft: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            color: "#555",
                          }}
                        >
                          ×
                        </span>
                      </span>
                    ))}

                    {/* Input for typing keywords */}
                    <input
                      type="text"
                      placeholder="Type keyword"
                      value={keywordInput}
                      onChange={handleKeywordChange}
                      onKeyDown={handleKeywordKeyDown}
                      style={{
                        border: "none",
                        outline: "none",
                        flex: "1",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        borderRadius: "12px",

                        minWidth: "120px",
                        marginTop: "0px"
                      }}
                    />

                    {/* Suggestion dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <ul
                        style={{
                          listStyle: "none",
                          margin: 0,
                          padding: "8px",
                          border: "1px solid #ccc",
                          background: "#fff",
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          width: "100%",
                          zIndex: 10,
                          maxHeight: "150px",
                          overflowY: "auto",
                        }}
                      >
                        {suggestions.map((s) => (
                          <li
                            key={s.id}
                            onClick={() => handleSuggestionClick(s)} // pass full object
                            style={{
                              padding: "6px 10px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {s.keyword_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 add-listing-form-col">
                <div className="custom-select">
                  <label>Developer Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData2.name}
                    onChange={handleChange2}
                    placeholder="Enter Developer Name"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 add-listing-form-col">
                <div className="custom-select">
                  <label className="mb-2">Description</label>
                  <br />
                  <Editor
                    apiKey={VITE_TINY_API_KEY}
                    value={formData2.description} // Set value instead of initialValue
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help",
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </div>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 add-listing-form-col">
                <label>Featured Image </label>
                <FeaturedImageUpload
                  onChange={(file) => {
                    setFormData2(prev => ({
                      ...prev,
                      featured_img: file
                    }));
                  }}
                  value={formData2.featured_img}
                />
              </div>
              {
                //   <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                //   <div className="custom-select">
                //     <label>Video &nbsp;(url)</label>
                //     <input
                //       type="text"
                //       name="video_url"
                //       value={formData2.video_url}
                //       onChange={handleChange2}
                //     />
                //   </div>
                // </div>
              }
              {
                //   <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                //   <div className="custom-select">
                //     <label>Property Video</label>
                //     <input
                //       type="file"
                //       name="property_video"
                //       onChange={handleFileChange}
                //       accept=".mp4"
                //     />
                //   </div>
                // </div>
                // <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                //   <div className="custom-select">
                //     <label>Video Tour</label>
                //     <input
                //       type="file"
                //       name="virtual_tour"
                //       onChange={handleFileChange}
                //     />
                //   </div>
                // </div>
              }

              {
                //   <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                //   <div className="custom-select">
                //     <label>Video Thumbnail</label>
                //     <input
                //       type="file"
                //       name="video_thumbnail"
                //       onChange={handleFileChange}
                //     />
                //   </div>
                // </div>
                // <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                //   <div className="custom-select">
                //     <div>
                //       <label>Gallery</label>
                //       <input type="file" multiple onChange={handleImageChange} />
                //       {
                //           <div>
                //           {images.map((image, index) => (
                //             <div key={index}>
                //               <img src={URL.createObjectURL(image)} alt={`image-${index}`} />
                //             </div>
                //           ))}
                //         </div>
                //       }
                //     </div>
                //   </div>
                // </div>
                // <div className="col-lg-4 col-md-4 col-sm-12 add-listing-form-col">
                //   <div className="custom-select">
                //     <label>Brochure</label>
                //     <input
                //       type="file"
                //       name="brochure"
                //       onChange={handleFileChange}
                //     />
                //   </div>
                // </div>
              }

              {/* <div className="col-lg-6 col-md-6 col-sm-12 add-listing-form-col">
                <label>Keyword </label>
                <Select
                  name="keyword"
                  value={options.filter((option) =>
                    keywordForm.keyword.includes(option.value)
                  )} // Match selected IDs with options
                  isMulti
                  onChange={handleSelectChange}
                  options={options}
                  placeholder="Select Keyword"
                  closeMenuOnSelect={false}
                />
  
                            <CreatableSelect
                              isMulti
                              name="option"
                              className="basic-multi-select w-full"
                              classNamePrefix="select"
                              placeholder="Type and press Enter..."
                              value={items[index]?.options || []} // Ensure it reads the existing options
                              onChange={(value) =>
                                handleChange(index, value, "options")
                              }
                              isClearable
                              formatCreateLabel={(inputValue) =>
                                `Add "${inputValue}"`
                              }
                            />
                      
              </div> */}

              {sortedCustomFields?.map((record, i) =>
                record.field_type === "text" ? (
                  <div
                    className={`col-lg-6 col-md-6 col-sm-12 add-listing-form-col ${record.field_type === "text" ? "" : "d-none"
                      }`}
                    key={i}
                  >
                    <label className="text-capitalize">
                      {record.field_label}
                      {record.required === "yes" && <span style={{ color: "var(--orange)" }}>*</span>}
                    </label>
                    <div className="custom-select">
                      <input
                        name="field_value"
                        type="text"
                        value={record.field_value || ''}
                        placeholder={record.field_placeholder}
                        onChange={(e) =>
                          handleChange(e, record.id || record.custom_field_id, record.field_type)
                        }
                      />
                      <p className="mt-1 text-success">
                        {record.field_name_description}
                      </p>
                      {errors[record.id] && (
                        <p className="text-danger mt-1">{errors[record.id]}</p>
                      )}
                      {/* {record.required ==="yes" && <span className="text-danger">**This field is required**</span>} */}
                    </div>
                  </div>
                ) : record.field_type === "number" ? (
                  <div
                    className={`col-lg-6 col-md-6 col-sm-12 add-listing-form-col ${record.field_type === "number" ? "" : "d-none"
                      }`}
                    key={i}
                  >
                    <label className="text-capitalize">
                      {record.field_label}
                      {record.required === "yes" && <span style={{ color: "var(--orange)" }}>*</span>}
                    </label>
                    <div className="custom-select">
                      <input
                        min={0}
                        onKeyDown={(e) => {
                          // prevent typing 'e', '+', '-', or '.'
                          if (["e", "E", "+", "-"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        name="field_value"
                        type="number"
                        value={record.field_value || ''}
                        placeholder={record.field_placeholder}
                        onChange={(e) =>
                          handleChange(e, record.id || record.custom_field_id, record.field_type)
                        }
                      />
                      <p className="mt-1 text-success">
                        {record.field_name_description}
                      </p>
                      {errors[record.id] && (
                        <p className="text-danger mt-1">{errors[record.id]}</p>
                      )}
                      {/* {record.required ==="yes" && <span className="text-danger">**This field is required**</span>} */}
                    </div>
                  </div>
                ) : record.field_type === "textarea" ? (
                  <div
                    className={`col-lg-12 col-md-12 col-sm-12 add-listing-form-col ${record.field_type === "textarea" ? "" : "d-none"
                      }`}
                    key={i}
                  >
                    <label className="text-capitalize">{record.field_label}{" "}{record.required === "yes" && <span style={{ color: "var(--orange)" }}>*</span>}</label>
                    <div className="custom-select">
                      <textarea
                        name="field_value"
                        value={record.field_value || ''}
                        placeholder={record.field_placeholder}
                        onChange={(e) =>
                          handleChange(e, record.id || record.custom_field_id, record.field_type)
                        }
                      />
                      <p className="mt-1 text-success">
                        {record.field_name_description}
                      </p>
                      {errors[record.id] && (
                        <p className="text-danger mt-1">{errors[record.id]}</p>
                      )}
                    </div>
                  </div>
                ) : record.field_type === "select" ? (
                  <div
                    className={`col-lg-6 col-md-6 col-sm-12 add-listing-form-col ${record.field_type === "select" ? "" : "d-none"
                      }`}
                    key={i}
                  >
                    <label className="text-capitalize">{record.field_label}{" "}{record.required === "yes" && <span style={{ color: "var(--orange)" }}>*</span>}</label>
                    <select
                      value={
                        record.options.find(
                          (option) =>
                            option.value?.toString().toLowerCase() ===
                            record.field_value?.toString().toLowerCase()
                        )?.value || ""
                      }
                      className="form-select form-select-map mb-1 mt-1"
                      name="field_value"
                      onChange={(e) =>
                        handleChange(e, record.id || record.custom_field_id, record.field_type)
                      }
                    >
                      <option selected disabled>
                        --Select Options--
                      </option>
                      {record.options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-success">
                      {record.field_name_description}
                    </p>
                    {errors[record.id] && (
                      <p className="text-danger mt-1">{errors[record.id]}</p>
                    )}
                  </div>
                ) : record.field_type === "checkbox" &&
                  record.checkbox_type === "manually" ? (
                  <div
                    className="col-lg-6 col-md-6 col-sm-12 add-listing-form-col"
                    key={i}
                  >
                    <label className="mb-3 text-capitalize">{record.field_label}{" "}{record.required === "yes" && <span style={{ color: "var(--orange)" }}>*</span>}</label>
                    <div className="d-flex flex-wrap checkbox-group">
                      {record.options.map((option, index) => (
                        <label
                          key={index}
                          className="checkbox-label d-flex align-center gap-2"
                        >
                          <input
                            type="checkbox"
                            name="field_value"
                            value={option.value}
                            checked={
                              Array.isArray(record.field_value) &&
                              record.field_value.some(
                                (val) =>
                                  val?.toString().toLowerCase() === option.value?.toString().toLowerCase()
                              )
                            }
                            onChange={(e) =>
                              handleChange(e, record.id || record.custom_field_id, record.field_type)
                            }
                          />
                          {option.name}
                        </label>
                      ))}

                    </div>
                    {errors[record.id] && (
                      <p className="text-danger mt-1">{errors[record.id]}</p>
                    )}
                  </div>
                ) : record.field_type === "checkbox" &&
                  record.checkbox_type === "import_from_aminities" ? (
                  <div
                    className="col-lg-6 col-md-6 col-sm-12 add-listing-form-col"
                    key={i}
                  >
                    <label className="mb-2 text-capitalize">{record.field_label}{" "}{record.required === "yes" && <span style={{ color: "var(--orange)" }}>*</span>}</label>
                    {record.options.map((option, index) => (
                      <div key={index} className="ms-2">
                        <h2 className="mb-2">{option.name}</h2>
                        <div className="checkbox-group">
                          {amenities.map((data, ind) => (
                            <div key={ind} className="d-flex ms-2">
                              {data.name === option.name &&
                                data.amenities.map((amenity, amInd) => (
                                  <label
                                    key={amInd}
                                    className="checkbox-label me-2"
                                  >
                                    <input
                                      type="checkbox"
                                      name="field_value"
                                      value={amenity.name}
                                      onChange={(e) =>
                                        handleChange(
                                          e,
                                          record.id || record.custom_field_id,
                                          record.field_type
                                        )
                                      }
                                    />
                                    {amenity.name}
                                  </label>
                                ))}
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                    {errors[record.id] && (
                      <p className="text-danger mt-1">{errors[record.id]}</p>
                    )}
                  </div>
                ) : record.field_type === "radio" ? (
                  <div
                    key={i}
                    className="col-lg-6 col-md-6 col-sm-12 add-listing-form-col"
                  >
                    <label className="mb-3 text-capitalize">{record.field_label}{" "}{record.required === "yes" && <span style={{ color: "var(--orange)" }}>*</span>}</label>

                    <div className="d-flex gap-3">
                      {record.options.map((option, index) => (
                        <label key={index} className="radio-label">
                          <input
                            type="radio"
                            name={`field_value_${record.id}`} // Ensure unique name for each field group
                            value={option.value}
                            defaultChecked={option.value === record.field_value}
                            onChange={(e) =>
                              handleChange(e, record.id || record.custom_field_id, record.field_type)
                            }
                          />
                          {option.name}
                        </label>
                      ))}
                    </div>

                    <p className="text-success mt-3">
                      {record.field_name_description}
                    </p>
                    {errors[record.id] && (
                      <p className="text-danger mt-1">{errors[record.id]}</p>
                    )}
                  </div>
                ) : record.field_type === "media" ? (
                  <div
                    className={`col-lg-6 col-md-6 col-sm-12 add-listing-form-col ${record.field_type === "media" ? "" : "d-none"
                      }`}
                    key={i}
                  >
                    <label>{record.field_label}</label>
                    <MediaUpload
                      key={i}
                      record={record}
                      handleChange={handleChange}
                      errors={errors}
                      value={record.field_value}
                    />
                    {/* {errors[record.id] && (
                      <p className="text-danger mt-1">{errors[record.id]}</p>
                    )} */}
                  </div>
                ) : record.field_type === "texteditor" ? (
                  <div
                    className={`col-lg-12 col-md-12 col-sm-12 add-listing-form-col ${record.field_type === "texteditor" ? "" : "d-none"
                      }`}
                    key={i}
                  >
                    <label className="text-capitalize">{record.field_label}{" "}{record.required === "yes" && <span style={{ color: "var(--orange)" }}>*</span>}</label>
                    <div className="custom-select">
                      <Editor
                        apiKey={VITE_TINY_API_KEY}
                        value={record.field_value || ''}
                        init={{
                          height: 300,
                          menubar: false,
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                          ],
                          toolbar:
                            "undo redo | formatselect | bold italic backcolor | \
                              alignleft aligncenter alignright alignjustify | \
                              bullist numlist outdent indent | removeformat | help",
                        }}
                        onEditorChange={(content) =>
                          handleChange(
                            content,
                            record.id || record.custom_field_id,
                            "texteditor",
                            "field_value"
                          )
                        }
                      />
                      <p className="mt-1 text-success">
                        {record.field_name_description}
                      </p>
                    </div>
                    {errors[record.id] && (
                      <p className="text-danger mt-1">{errors[record.id]}</p>
                    )}
                  </div>
                ) : record.field_type === "file" ? (
                  <div
                    className={`col-lg-6 col-md-6 col-sm-12 add-listing-form-col ${record.field_type === "file" ? "" : "d-none"
                      }`}
                    key={i}
                  >
                    <label>{record.field_label}</label>
                    <MediaUpload
                      key={i}
                      record={record}
                      handleChange={handleChange}
                      errors={errors}
                      value={record.field_value}
                    />
                    {/* {errors[record.id] && (
                      <p className="text-danger mt-1">{errors[record.id]}</p>
                    )} */}
                  </div>
                ) : record.field_type === "repeater" ? (
                  <>
                    <div
                      className="col-lg-12 col-md-12 col-sm-12 add-listing-form-col"
                      key={i}
                    >
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${i}-content`}
                          id={`panel${i}-header`}
                        >
                          {record.field_label}{" "}{record.required === "yes" && <span style={{ color: "var(--orange)" }}>*</span>}
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* {record.repeater_fields.filter(r => r.index === i).map((repeater, rIndex) => (
                        <div key={rIndex}> */}
                          {Array.isArray(record.field_value) &&
                            record.field_value.map((group, groupIndex) => (
                              <>
                                {Array.isArray(group) &&
                                  group.map((item, index) => (
                                    <div key={index} className="custom-select mb-3">
                                      <label className="text-capitalize">{item.field_label}{" "}{record.required === "yes" && <span style={{ color: "var(--orange)" }}>*</span>}</label>
                                      {item.field_type === "texteditor" ? (
                                        <Editor
                                          apiKey={VITE_TINY_API_KEY}
                                          value={item.field_value || ''}
                                          init={{
                                            height: 200,
                                            menubar: false,
                                            plugins: [
                                              "advlist autolink lists link image charmap print preview anchor",
                                              "searchreplace visualblocks code fullscreen",
                                              "insertdatetime media table paste code help wordcount",
                                            ],
                                            toolbar:
                                              "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                                          }}
                                          onEditorChange={(content) =>
                                            handleTextEditor(
                                              content,
                                              record.id || record.custom_field_id,
                                              item.id || item.sub_field_id,
                                              item.field_type,
                                              item.field_name,
                                              groupIndex,
                                            )
                                          }
                                        />
                                      ) : item.field_type === "textarea" ? (
                                        <textarea
                                          name="field_value"
                                          value={item.field_value}
                                          onChange={(e) =>
                                            handleChangeRepeater(
                                              e,
                                              record.id || record.custom_field_id,
                                              item.id || item.sub_field_id,
                                              item.field_type,
                                              groupIndex,
                                              name = "field_value",
                                            )
                                          }
                                        />
                                      ) : item.field_type === "media" ? (
                                        <div>
                                          <MediaUploadEdit
                                            groupIndex={groupIndex}
                                            record={item}
                                            handleChangeRepeater={handleChangeRepeater}
                                            errors={errors}
                                            value={item.field_value}
                                          />
                                        </div>
                                      ) : item.field_type === "text" ? (
                                        <div
                                          className={`col-lg-12 col-md-12 col-sm-12 add-listing-form-col ${item.field_type === "text" ? "" : "d-none"
                                            }`}
                                          key={i}
                                        >

                                          <div className="custom-select">
                                            <input
                                              name="field_value"
                                              type="text"
                                              placeholder={item.field_placeholder}
                                              value={item.field_value}
                                              onChange={(e) =>
                                                handleChangeRepeater(
                                                  e,
                                                  record.id || record.custom_field_id,
                                                  item.id || item.sub_field_id,
                                                  item.field_type,
                                                  groupIndex,
                                                  name = "field_value",

                                                )
                                              }
                                            />
                                            <p className="mt-1 text-success">
                                              {item.field_name_description}
                                            </p>
                                            {errors[item.id] && (
                                              <p className="text-danger mt-1">
                                                {errors[item.id]}
                                              </p>
                                            )}
                                            {/* {item.required ==="yes" && <span className="text-danger">**This field is required**</span>} */}
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  ))}
                                {errors[record.id] && (
                                  <p className="text-danger mt-1">{errors[record.id]}</p>
                                )}
                              </>
                            ))}
                          <div className="d-flex align-items-center justify-content-between repeater-sub-field">
                            <div

                              className="d-flex justify-content-end "
                              style={{
                                cursor: "pointer",
                                width: "max-content",
                              }}
                              onClick={() => handleAddRepeater(i, record)}
                            >
                              + Add Field
                            </div>
                            <button
                              type="button"
                              className="add-property-send-btn  add-property-remove-btn"
                              onClick={() => handleRemoveRepeater(record.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> {/* <!-- Icon from Material Design Light by Pictogrammers - https://github.com/Templarian/MaterialDesignLight/blob/master/LICENSE.md --> */}
                                <path fill="red" d="M7 12h9v1H7zm4.5-9a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3m0 1A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4" /></svg>

                            </button>

                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </>
                ) : null
              )}


              <div
                className="col-lg-6 col-md-6 col-sm-12 add-listing-form-col"
              >
                <label className="mb-3">Status</label>

                <div className="d-flex gap-3">
                  {[{ label: "Ready for Publish", value: "active" }, { label: "Save as Draft", value: "deactive" }].map((option, index) => (
                    <label key={index} className="radio-label">
                      <input
                        type="radio"
                        name={`template_status`} // Ensure unique name for each field group
                        value={option.value}
                        onChange={() => handleStatusChange(option.value)}
                        checked={formData2.temporary_status === option.value} // Corrected
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {progress ? (
              <div className="add-property-send-btn add-property-send-dv mt-4">
                <div class="spinner-border text-dark" role="status">
                  <span className="sr-only"></span>
                </div>
                <span>send</span>
              </div>
            ) : (
              <button className="add-property-send-btn mt-4">
                <span>Submit</span>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}


export default EditDeveloper
