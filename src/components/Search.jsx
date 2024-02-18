import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

// SearchComponent functional component definition
const SearchComponent = ({ onSearch }) => {
  // Event handler for handling search input change
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    // Call the onSearch prop with the updated search term
    onSearch(searchTerm);
  };

  // Render the search input component
  return (
    <TextField
      placeholder="Search"
      variant="outlined"
      fullWidth
      onChange={handleSearch}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton size="large">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchComponent;
