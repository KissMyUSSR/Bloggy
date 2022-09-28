import z from 'zod';

import { Form, InputField } from 'components/Form';
import { Button, Drawer } from 'components/Elements';
import { ConfirmPasswordValues } from '../types';

type ConfirmPasswordFormValues = Exclude<ConfirmPasswordValues, void>;

type ConfirmPasswordProps = {
  closeMenu: () => unknown;
  onSuccess: (values: ConfirmPasswordFormValues) => unknown;
};

const schema = z.object({
  'old-password': z
    .string()
    .min(3, 'Password must be at least 3 characters long')
    .max(20, 'Password must be at most 20 characters long'),
});

export function ConfirmPasswordForm({
  closeMenu,
  onSuccess,
}: ConfirmPasswordProps) {
  return (
    <Drawer id="authentification" closeMenu={closeMenu} className="pt-8 pb-5">
      <Form<ConfirmPasswordFormValues, typeof schema> onSubmit={onSuccess}>
        {({ register, formState }) => (
          <>
            <InputField
              type="password"
              label="Confirm your password"
              error={formState.errors['old-password']}
              registration={register('old-password')}
            />

            <Button type="submit">Confirm</Button>
          </>
        )}
      </Form>
    </Drawer>
  );
}