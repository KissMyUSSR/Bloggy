import clsx from 'clsx';
import { useState } from 'react';

import { Icon, ProfilePicture } from 'components/Elements';
import { AuthDrawer, useLogoutMutation } from 'features/auth';
import { useAppSelector } from 'stores/rootStore';
import { useDisclosure, useOnClickOutside } from 'hooks';
import { useNavigate } from 'react-router';

export function TopbarUserMenu() {
  const navigate = useNavigate();
  const { close, toggle, isOpen } = useDisclosure();
  const menu = useOnClickOutside<HTMLDivElement>(close);
  const [authOpen, setAuthOpen] = useState<false | 'login' | 'signup'>(false);
  const isLoggedIn = useAppSelector((state) => state.authSlice.isLoggedIn);
  const user = useAppSelector((state) => state.authSlice.user);
  const [logout] = useLogoutMutation();

  return (
    <div
      ref={menu}
      className="h-full flex items-center justify-center xl:relative"
    >
      <button
        className="flex items-center"
        onClick={toggle}
        data-testid="topbar-user-menu"
      >
        <ProfilePicture className="h-8 sm:h-10 select-none" />
        <Icon
          type="angle"
          className={clsx(
            'relative h-6 transition-transform',
            isOpen ? 'rotate-90' : '-rotate-90'
          )}
        />
      </button>

      <div
        className={clsx(
          'z-20 absolute right-0 top-full transition-[height] overflow-hidden',
          isOpen ? (user?.blog ? 'flex h-48' : 'flex h-32') : 'h-0'
        )}
      >
        <div
          className={clsx(
            'flex flex-col w-60 h-max text-xl font-medium bg-secondary-800 [&>*]:border-opacity-10 [&>*]:border-main [&>*]:border-t [&>*:first-child]:border-none',
            isOpen
              ? 'visible'
              : 'transition-[visibility] duration-[0ms] delay-200 invisible'
          )}
        >
          {isLoggedIn ? (
            <>
              {user?.blog && (
                <MenuButton
                  onClick={() => {
                    close();
                    navigate(`/blog/${user.username}`);
                  }}
                >
                  My blog
                </MenuButton>
              )}
              <MenuButton
                onClick={() => {
                  close();
                  navigate('/settings');
                }}
              >
                Settings
              </MenuButton>
              <MenuButton
                onClick={() => {
                  close();
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </MenuButton>
            </>
          ) : (
            <>
              <MenuButton
                onClick={() => {
                  setAuthOpen('signup');
                  close();
                }}
              >
                Sign up
              </MenuButton>
              <MenuButton
                onClick={() => {
                  setAuthOpen('login');
                  close();
                }}
              >
                Log in
              </MenuButton>
            </>
          )}
        </div>
      </div>

      {authOpen ? (
        <AuthDrawer closeMenu={() => setAuthOpen(false)} authType={authOpen} />
      ) : null}
    </div>
  );
}

type MenuButtonProps = {
  onClick?: () => unknown;
  children?: React.ReactNode;
};

const MenuButton = ({ onClick, children }: MenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="group h-16 flex justify-center items-center hover:bg-secondary-200 hover:text-secondary-800"
    >
      <span className="transition-all inline-block group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:drop-shadow-[4px_4px_2px_rgba(0,0,0,0.15)]">
        {children}
      </span>
    </button>
  );
};
