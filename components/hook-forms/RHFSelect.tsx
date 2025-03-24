// form
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SelectProp } from '../ui/Select';

// ----------------------------------------------------------------------

type IProps = SelectProp & {
  name: string;
};

export default function RHFSelect({ name, ...other }: IProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <Select {...field} error={invalid} helperText={error?.message} {...other} />
      )}
    />
  );
}
