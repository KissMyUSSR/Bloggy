import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import { useDisclosure, useOnClickOutside } from 'hooks';
import { useAppSelector } from 'stores/rootStore';
import { Icon } from 'components/Elements';

type NavigationProps = {
  links: [string, string][];
};

export function TopbarNavigation({ links }: NavigationProps) {
  const { isOpen, close, toggle } = useDisclosure();
  const container = useOnClickOutside<HTMLDivElement>(close);
  const isLoggedIn = useAppSelector((state) => state.authSlice.isLoggedIn);

  return (
    <>
      <div
        ref={container}
        className={'MOBILE-MENU basis-1/2 flex items-center p-2 h-12 lg:hidden'}
      >
        <button
          className={clsx('hamburger-menu-btn', isOpen && 'open')}
          onClick={toggle}
        >
          <span />
          <span />
          <span />
        </button>
        <ul
          className={clsx(
            !isOpen && '-translate-x-screen',
            'absolute top-20 left-0 transition-transform flex flex-col bg-secondary-800 w-full'
          )}
        >
          {links.map((link, i) => (
            <li
              key={i}
              className="group text-xl font-medium transition-colors hover:bg-secondary-600 hover:text-secondary-200 "
            >
              <NavLink
                onClick={toggle}
                to={link[1]}
                className="p-4 sm:p-5 block w-full h-full"
              >
                <span className="transition-all inline-block group-hover:scale-110 group-hover:translate-x-1 group-hover:font-bold group-hover:drop-shadow-[-4px_4px_1px_rgba(0,0,0,0.15)]">
                  {link[0]}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
        {isLoggedIn && (
          <NavLink
            data-testid="create-top-nav-link"
            to="/create"
            className="lg:hidden ml-2 xs:ml-3 sm:ml-4 md:ml-6"
          >
            <Icon type="plus" className="h-10 sm:h-12 text-main" />
          </NavLink>
        )}
      </div>

      <div className="DESKTOP-MENU hidden lg:block basis-1/2 h-full">
        <ul className="w-52 h-full flex justify-between gap-5 xl:gap-7">
          {links.map((link, i) => (
            <li key={i} className="flex items-center text-xl font-medium]">
              <NavLink
                to={link[1]}
                className="transition-all hover-bottom-border"
              >
                {link[0]}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
