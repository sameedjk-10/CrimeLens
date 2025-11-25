import { useState } from "react";

interface AllRecordsSearchProps {
  onSearchChange: (searchBy: string, value: string) => void;
}

export default function AllRecordsSearch({ onSearchChange }: AllRecordsSearchProps) {
  const [searchBy, setSearchBy] = useState("all"); // default to "all"
  const [value, setValue] = useState("");

  const handleSearch = () => {
    if (searchBy === "all" || value.trim() === "") {
      onSearchChange("", ""); // show all records
      return;
    }

    // For date picker, value is already in YYYY-MM-DD format
    const formattedValue = searchBy === "incidentDate" ? value : value.trim();

    onSearchChange(searchBy, formattedValue);
  };

  // Dynamic placeholder
  const placeholderText =
    searchBy === "incidentDate"
      ? "" // no placeholder needed for date picker
      : "Enter search value...";

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 flex items-center gap-x-4">
      {/* Label */}
      <span className="text-gray-700 font-outfit text-sm">Search by</span>

      {/* Dropdown */}
      <select
        className="border rounded-lg px-3 py-2 text-sm bg-gray-50"
        value={searchBy}
        onChange={(e) => {
          setSearchBy(e.target.value);
          setValue(""); // clear input when changing dropdown
        }}
      >
        <option value="all">-- All --</option>
        <option value="id">Case ID</option>
        <option value="incidentDate">Date</option>
        <option value="zoneName">Zone Name</option>
        <option value="crimeTypeName">Crime Type</option>
        <option value="submitterCnic">Submitter CNIC</option>
        <option value="registeredBranchId">Branch ID</option>
      </select>

      {/* Input field */}
      {searchBy === "incidentDate" ? (
        <input
          type="date"
          className="border rounded-lg px-3 py-2 w-64 text-sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="border rounded-lg px-3 py-2 w-64 text-sm"
          placeholder={placeholderText}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={searchBy === "all"}
        />
      )}

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-[#237E54] text-white px-4 py-2 rounded-lg font-outfit text-sm hover:bg-[#1d6b48]"
      >
        Search
      </button>
    </div>
  );
}
