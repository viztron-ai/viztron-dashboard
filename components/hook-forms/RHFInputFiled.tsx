// form
import { Controller, useFormContext } from 'react-hook-form';

import TextField, { TextFieldProp } from '../ui/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProp & {
  name: string;
};

export default function RHFTextField({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField {...field} error={invalid} helperText={error?.message} {...other} />
      )}
    />
  );
}
