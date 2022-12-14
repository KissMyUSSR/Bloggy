import { useNavigate } from 'react-router';

import { useAppSelector } from 'stores/rootStore';
import { useDisclosure } from 'hooks';
import { ResetPasswordForm, useLogoutMutation } from 'features/auth';
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
} from '../api/settingsApi';
import {
  SettingsButton,
  UpdateUserForm,
  UpdateProfilePictureForm,
  ConfirmPasswordForm,
} from '.';
import { useNotifyError } from 'features/notifications';

type AccountSettingsProps = {
  changeTab: () => unknown;
};

export function AccountSettings({ changeTab }: AccountSettingsProps) {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authSlice.user);

  const [logout] = useLogoutMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteAccount] = useDeleteUserMutation();
  const notifyError = useNotifyError();

  const resetPasswordDisclosure = useDisclosure();
  const deleteAccountDisclosure = useDisclosure();

  if (user === null) throw Error('User data is null!');

  return (
    <div className="w-full">
      <h3 className="text-3xl font-medium font-display mb-5">Account</h3>

      <div className="space-y-4">
        <UpdateUserForm updateSelector="email" />
        <UpdateUserForm updateSelector="username" />
        <UpdateUserForm updateSelector="password" />
      </div>

      <button
        type="button"
        className="block text-sm text-secodary-600 hover:underline mb-8"
        onClick={() => resetPasswordDisclosure.open()}
      >
        Reset password
      </button>
      {resetPasswordDisclosure.isOpen && (
        <ResetPasswordForm closeMenu={resetPasswordDisclosure.close} />
      )}

      <UpdateProfilePictureForm />

      <div className="flex gap-6">
        {!user.blog && (
          <SettingsButton
            onClick={async () => {
              const response = await updateUser({ blog: {} });

              if ('error' in response) return notifyError(response.error);

              changeTab();
            }}
          >
            Create blog
          </SettingsButton>
        )}
        <SettingsButton
          variant="danger"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Logout
        </SettingsButton>
        <SettingsButton variant="danger" onClick={deleteAccountDisclosure.open}>
          Delete account
        </SettingsButton>
      </div>
      {deleteAccountDisclosure.isOpen && (
        <ConfirmPasswordForm
          closeMenu={deleteAccountDisclosure.close}
          onSubmit={async (values) => {
            const response = await deleteAccount(values);

            if ('error' in response) return notifyError(response.error);
            deleteAccountDisclosure.close();
          }}
        />
      )}
    </div>
  );
}
