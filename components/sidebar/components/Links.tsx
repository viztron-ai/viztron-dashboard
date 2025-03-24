'use client';

/* eslint-disable */
import NavLink from '@/components/link/NavLink';
import { IRoute } from '@/types/types';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useCallback, useState } from 'react';

interface SidebarLinksProps extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

export function SidebarLinks(props: SidebarLinksProps) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname]
  );

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, key) => {
      const isActive = activeRoute(route.path.toLowerCase());
      const isHovered = hoveredIndex === key;
      
      if (route.disabled) {
        return (
          <div
            key={key}
            className="relative flex w-full cursor-not-allowed rounded-lg py-2.5 px-3 my-1 opacity-60"
          >
            <div className="flex w-full items-center">
              {/* Simplified icon container for disabled items */}
              <div className="grid place-items-center h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 mr-3">
                <div className="text-zinc-400 dark:text-zinc-500">
                  {route.icon}
                </div>
              </div>
              <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                {route.name}
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div 
            key={key}
            onMouseEnter={() => setHoveredIndex(key)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="my-1"
          >
            <div
              className={`relative rounded-lg transition-all duration-200 ease-in-out backdrop-blur-sm
                ${isActive 
                  ? 'bg-white/90 dark:bg-zinc-800/90 shadow-sm' 
                  : isHovered
                    ? 'bg-zinc-100/80 dark:bg-zinc-800/80'
                    : 'bg-transparent'
                }`}
            >
              {/* Subtle left indicator for active item */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-gradient-to-b from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300 rounded-full"></div>
              )}
              
              <NavLink
                href={route.layout ? route.layout + route.path : route.path}
                key={key}
                styles={{ width: '100%' }}
              >
                <div className="flex w-full items-center py-2.5 px-3">
                  {/* Using CSS Grid for perfect centering */}
                  <div 
                    className={`grid place-items-center h-8 w-8 rounded-lg mr-3 transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-500 dark:to-blue-400 shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800'
                      }`}
                    style={{ display: 'grid', placeItems: 'center' }}
                  >
                    <div 
                      className={`${isActive ? 'text-white mt-1' : 'text-zinc-500 dark:text-zinc-400'}`}
                      style={{ lineHeight: 0 }}
                    >
                      {route.icon}
                    </div>
                  </div>
                  
                  {/* Text with gradient effect when active */}
                  <p
                    className={`text-sm transition-all duration-200 ${
                      isActive
                        ? 'font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300'
                        : 'font-medium text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {route.name}
                  </p>
                </div>
              </NavLink>
            </div>
          </div>
        );
      }
    });
  };

  return <div className="px-2">{createLinks(routes)}</div>;
}

export default SidebarLinks;