import React, { useState, useEffect, useRef } from "react";
import "./searchableDropdown.css";

const SearchableDropdown = ({ data = [], placeholder = "Select...", onSelect, selectedId = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const menuRef = useRef(null);

    // 🔹 Sync selected when selectedId or data changes
    useEffect(() => {
        if (selectedId) {
            const match = data.find((item) => item.value === selectedId);
            if (match) setSelected(match);
        } else {
            setSelected(null);
        }
    }, [selectedId, data]);

    const filteredData = data.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
    );

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item) => {
        setSelected(item);
        setIsOpen(false);
        setSearch("");
        if (onSelect) onSelect(item.value);
    };

    const handleClear = (e) => {
        e.stopPropagation(); // prevent dropdown toggle
        setSelected(null);
        if (onSelect) onSelect(null);
    };

    return (
        <div className="form-group" ref={menuRef}>
            <div className="dropdown-select" onClick={() => setIsOpen((prev) => !prev)}>
                {selected ? selected.label : placeholder}
                <span className="form-actions">
                    {selected && (
                        <button
                            type="button"
                            className="clear-btn-search"
                            onClick={handleClear}
                        >
                            ✕
                        </button>
                    )}
                    <i className="bx bx-chevron-down"></i>
                </span>
            </div>

            {isOpen && (
                <div className="dropdown-menu-search-out">
                    <input
                        type="text"
                        className="dropdown-menu-search"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="dropdown-menu-inner">
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <div
                                    key={item.value}
                                    className={`dropdown-menu-item ${selected?.value === item.value ? "is-select" : ""
                                        }`}
                                    onClick={() => handleSelect(item)}
                                >
                                    {item.label}
                                </div>
                            ))
                        ) : (
                            <div className="dropdown-menu-item">No results</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
