import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, Typography } from "@mui/material";
import { SettingsBackupRestoreRounded } from '@mui/icons-material';
import { SelectionState } from 'draft-js';

interface ItemProps {
  value: string;
  show: string;
}
interface SelectLabelsProps {
  label?: string;
  allOptions?: ItemProps[];
  name?: string;
  formik?: any;
};

export default function SelectLabels({label, allOptions, name, formik}: SelectLabelsProps) {
  const [code, setCode] = React.useState('');
  
  return (
    <Box sx={{ width: "calc(100% - 40px)"}}>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel
          sx={formik.touched[name] && formik.errors[name] && {
            color: (theme) => (
              {
                md: theme.palette.error.main
              }
            ),
          }}
        >
          {label}
        </InputLabel>
        <Select
          value={formik.values[name]}
          name={name}
          label={label}
          onChange={formik.handleChange}
          error={Boolean(formik.touched[name] && formik.errors[name])}
          onBlur={formik.handleBlur}
        >
          {allOptions?.map((item)=>
            <MenuItem value={item.value} key={item.value}>{item.show}</MenuItem>
          )}
        </Select>
        <Typography sx={{
          fontSize:'12px',
          marginLeft:"14px",
          marginTop: "3px",
          color: (theme) => (
            {
              md: theme.palette.error.main
            }
          ),}}>
          {formik.touched[name] && formik.errors[name]}
        </Typography>
      </FormControl>
    </Box>
  );
}