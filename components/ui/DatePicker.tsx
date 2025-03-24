import {
  FormControl,
  FormLabel,
  TextField as InputField,
  TextFieldProps as InputFieldProps
} from '@mui/material';
import {
  DatePickerProps as MuiDatePickerProps,
  DatePicker as MuiDatePicker
} from '@mui/x-date-pickers';

export type DatePickerProps = MuiDatePickerProps<Date> & {
  label: string;
  fullWidth?: boolean;
  error?: boolean
};

export default function DatePicker({ label, error, ...props }: DatePickerProps) {
  return (
    <FormControl fullWidth={props.fullWidth} error={error}>
      <FormLabel>{label}</FormLabel>
      <MuiDatePicker fullWidth {...props} />
    </FormControl>
  );
}
