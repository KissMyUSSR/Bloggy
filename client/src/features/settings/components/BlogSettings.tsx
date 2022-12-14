import { useState } from 'react';
import * as z from 'zod';

import { Form, TextAreaField } from 'components/Form';
import { Picker, Tooltip } from 'components/Elements';
import { useUpdateUserMutation } from '../api/settingsApi';
import { SettingsButton } from '.';
import { useAppSelector } from 'stores/rootStore';
import { useNotifyError } from 'features/notifications';

const schema = z.object({
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters long'),
});

type BlogValues = {
  description: string;
};

type BlogSettingsProps = {
  changeTab: () => unknown;
};

export function BlogSettings({ changeTab }: BlogSettingsProps) {
  const blog = useAppSelector((state) => state.authSlice.user?.blog);
  const [categories, setCategories] = useState<string[]>(
    blog?.categories || []
  );
  const [updateUser] = useUpdateUserMutation();
  const notifyError = useNotifyError();

  return (
    <div className="w-full">
      <h3 className="text-3xl font-medium font-display mb-5">Blog</h3>
      <Form<BlogValues, typeof schema>
        className="mx-auto w-full space-y-6"
        onSubmit={async (values) => {
          const blogData = {
            blog: {
              ...values,
              categories,
            },
          };
          const response = await updateUser(blogData);

          if ('error' in response) return notifyError(response.error);
        }}
      >
        {({ register, formState }) => (
          <>
            <TextAreaField
              defaultValue={blog?.description}
              label="Blog description"
              error={formState.errors['description']}
              registration={register('description')}
            />

            <div>
              <div className="flex items-center font-light text-sm mb-2">
                Add categories that your blog specializes in
                <Tooltip outerText="?">
                  Please choose categories in order of their importance to you.
                  Also, you will be able to make posts from any category. They
                  are needed mostly for search optimization.
                </Tooltip>
              </div>
              <Picker
                data={categories}
                setData={setCategories}
                maxLength={10}
              />
            </div>

            <div className="flex gap-6">
              <SettingsButton type="submit">Update blog</SettingsButton>
              <SettingsButton
                variant="danger"
                onClick={async () => {
                  const response = await updateUser({
                    blog: { shouldDelete: true },
                  });

                  if ('error' in response) return notifyError(response.error);
                  changeTab();
                }}
              >
                Delete blog
              </SettingsButton>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
