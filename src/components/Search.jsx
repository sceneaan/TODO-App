import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const SearchComponent = ({ onSearch }) => {
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    onSearch(searchTerm);
  };

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
