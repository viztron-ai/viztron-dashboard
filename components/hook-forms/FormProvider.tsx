// form
import type { UseFormReturn } from 'react-hook-form';
import { FormProvider as Form } from 'react-hook-form';

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
  id?: string;
  classNames?: string;
};

export default function FormProvider({
  children,
  onSubmit,
  methods,
  id,
  classNames = '',
}: Props) {
  return (
    <Form {...methods}>
      <form
        id={id}
        onSubmit={onSubmit}
        className={`flex flex-col gap-5 ${classNames}`}
      >
        {children}
      </form>
    </Form>
  );
}
