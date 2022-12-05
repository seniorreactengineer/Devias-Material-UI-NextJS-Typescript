import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Box, Typography } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

interface AllOptionsProps {
  value: string;
  show: string;
}
interface MultipleSelectCheckmarksProps {
  label: string;
  allOptions: AllOptionsProps[];
  formik: any;
  name: string;
};

export default function MultipleSelectCheckmarks({label, allOptions, formik, name}: MultipleSelectCheckmarksProps) {
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    
  };
 
  return (
    <Box sx={{ width: "calc(100% - 40px)"}}>
      <FormControl sx={{ width: "100%"}}>
        <InputLabel 
          sx={!formik.values[name].length && formik.errors[name] && {
            color: (theme) => (
              {
                md: theme.palette.error.main
              }
            ),
          }}>
            {label}
        </InputLabel>
        <Select
          autoFocus
          multiple
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          onBlur={formik.handleBlur}
          error={Boolean(!formik.values[name].length && formik.errors[name])}
        >
          {allOptions?.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              <Checkbox checked={formik.values[name].indexOf(item.value) > -1} />
              <ListItemText primary={item.show} />
            </MenuItem>
          ))}
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
          {!formik.values[name].length && formik.errors[name]}
        </Typography>
      </FormControl>
    </Box>
  );
}