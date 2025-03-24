import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps
} from '@mui/material';

export type SelectProp = MuiSelectProps & {
  label: string;
  id: string;
  options: { label: string; value: string | number }[];
  helperText?: string;
};

export default function Select({
  label,
  id,
  options,
  helperText,
  ...props
}: SelectProp) {
  return (
    <FormControl fullWidth={props.fullWidth} error={props.error}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <MuiSelect id={id} fullWidth variant="outlined" {...props}>
        {options.map((option) => (
          <MenuItem value={option.value} key={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
