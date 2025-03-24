import { FormControl, FormLabel, TextField as InputField, TextFieldProps as InputFieldProps } from "@mui/material";

export type TextFieldProp = InputFieldProps & {
  label: string;
  id: string;
}

export default function TextField({label, id, ...props}: TextFieldProp) {
  return (
    <FormControl fullWidth={props.fullWidth} error={props.error}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <InputField
        id={id}
        fullWidth
        variant="outlined"
        {...props}
      />
    </FormControl>
  );
}
