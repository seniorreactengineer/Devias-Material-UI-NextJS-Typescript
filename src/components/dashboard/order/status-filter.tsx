import type { ChangeEvent, FC } from "react";
import PropTypes from "prop-types";

import { Checkbox, FormControlLabel, Menu, MenuItem } from "@mui/material";

import { Box } from "@mui/system";

interface StatusSelectProps {
  label: string;
  onChange?: (value: unknown[]) => void;
  options: { label: string; value: unknown }[];
  value: unknown[];
}

export const StatusSelect: FC<StatusSelectProps> = (props) => {
  const { label, onChange, options, value = [], ...other } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let newValue = [...value];

    if (event.target.checked) {
      if (event.target.value === "all") {
        options.map((option) => newValue.push(option.value));
      } else newValue.push(event.target.value);
    } else {
      if (event.target.value === "all") {
        newValue = [];
      } else {
        newValue = newValue.filter(
          (item) => item !== event.target.value && item !== "all"
        );
      }
    }

    onChange?.(newValue);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "110px 120px 300px 280px 270px",
      }}
    >
      {options.map((option, index) => (
        <MenuItem key={option.label}>
          <FormControlLabel
            control={
              <Checkbox
                checked={value.includes(option.value)}
                onChange={handleChange}
                value={option.value}
              />
            }
            label={option.label}
            sx={{
              flexGrow: 1,
              mr: 0,
            }}
          />
        </MenuItem>
      ))}
    </Box>
  );
};

StatusSelect.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
};
