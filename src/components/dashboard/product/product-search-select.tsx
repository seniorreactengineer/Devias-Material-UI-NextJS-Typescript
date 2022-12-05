
import React, { useState, useMemo, FC } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ListSubheader,
  TextField,
  InputAdornment,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const containsText = (text, searchText) =>
  text?.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

interface ItemProps {
  value: any;
  show: string
}
interface SearchSelectProps {
	allOptions: ItemProps[];
	label: string;
  name: string;
  formik: any;
}

export const SearchSelect: FC<SearchSelectProps> = ({allOptions, label, name, formik}) => {
  const [selectedOption, setSelectedOption] = useState<string>();
  const [searchText, setSearchText] = useState("");
 
  const displayedOptions = useMemo(
    () => allOptions?.filter((option) => containsText(option.show, searchText)),
    [searchText]
  );

  return (
    <Box sx={{ width: "calc(100% - 40px)"}}>
      <FormControl fullWidth>
        <InputLabel id="search-select-label">{label}</InputLabel>
        <Select
          // Disables auto focus on MenuItems and allows TextField to be in focus
          MenuProps={{ autoFocus: false }}
          labelId="search-select-label"
          id="search-select"
          name={name}
          label={label}
          value={formik.values[name]}
          onChange={formik.handleChange}
          error={Boolean(formik.touched[name] && formik.errors[name])}
          onClose={() => setSearchText("")}
          // This prevents rendering empty string in Select's value
          // if search text would exclude currently selected option.
          renderValue={() => allOptions?.filter((item)=>item.value === formik.values[name]).length && allOptions?.filter((item)=>item.value === formik.values[name])[0].show}
        >
          {/* TextField is put into ListSubheader so that it doesn't
              act as a selectable item in the menu
              i.e. we can click the TextField without triggering any selection.*/}
          <ListSubheader>
            <TextField
              size="small"
              // Autofocus on textfield
              autoFocus
              placeholder="Type to search..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
            />
          </ListSubheader>
          {displayedOptions?.map((option, i) => (
            <MenuItem key={i} value={option.value}>
              {option.show}
            </MenuItem>
          ))}
        </Select>
        <Typography>{formik.touched[name] && formik.errors[name]}</Typography>
      </FormControl>
    </Box>
  );
}
