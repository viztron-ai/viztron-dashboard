// form
import { Controller, useFormContext } from 'react-hook-form';

import TextField, { TextFieldProp } from '../ui/TextField';
import DatePicker, { DatePickerProps } from '../ui/DatePicker';

// ----------------------------------------------------------------------

type Props = DatePickerProps & {
  name: string;
};

export default function RHFDatePicker({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <DatePicker
          {...field}
          error={invalid}
          slotProps={{
            textField: {
              helperText: error?.message
            }
          }}
          {...other}
        />
      )}
    />
  );
}
