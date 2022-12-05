import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface CheckboxProps {
  checked: boolean;
  setMoreOption: (checked: any) => void;
}
export default function CheckboxLabel(props: CheckboxProps) {
  return (
    <FormGroup sx={{paddingTop: "20px"}}>
      <FormControlLabel control={<Checkbox checked = {props.checked} onClick={()=>props.setMoreOption((prevState)=>!prevState)} />} label="More Options Attributes" />
    </FormGroup>
  );
}