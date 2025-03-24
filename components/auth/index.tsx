'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { HiBolt } from 'react-icons/hi2';

interface DefaultAuthLayoutProps extends PropsWithChildren {
  children: JSX.Element;
  viewProp: any;
}

export default function DefaultAuthLayout(props: DefaultAuthLayoutProps) {
  const { children } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <div className="relative h-max dark:bg-zinc-950">
      <div className="mx-auto flex w-full flex-col justify-center px-5 pt-0 md:h-[unset] md:max-w-[66%] lg:h-[100vh] lg:max-w-[66%] lg:px-6 xl:pl-0 ">
        {children}
        <div className="fixed right-0 hidden h-full min-h-[100vh] xl:block xl:w-[50vw] 2xl:w-[44vw]">
          <div className="flex h-full w-full flex-col items-end justify-center bg-zinc-950 dark:bg-zinc-900">
            <div
              className={`mb-[160px] mt-8 flex w-full items-center justify-center `}
            >
              <div className="me-2 flex h-[76px] w-[76px] items-center justify-center rounded-md bg-white text-zinc-950 dark:text-zinc-900">
                <HiBolt className="h-9 w-9" />
              </div>
              <h5 className="text-4xl font-bold leading-5 text-white">
                Viztron
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
