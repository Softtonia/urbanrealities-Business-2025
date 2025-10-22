const customStyles = {
    control: (provided) => ({
        ...provided,
        width: "100%",
        border: "1px solid var(--borderLine)",
        padding: "1px 1px", // React-Select already has padding, keep it minimal
        borderRadius: "12px",
        marginTop: "7px",
        minHeight: "30px", // to match your input height
        boxShadow: "none",
        "&:hover": {
            borderColor: "var(--borderLine)",
        },
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: "0 10px", // inner padding like input
    }),
    input: (provided) => ({
        ...provided,
        margin: "0px",
        padding: "0px",
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#aaa",
    }),
};

export default customStyles;
