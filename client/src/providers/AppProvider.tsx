import { Suspense, ReactNode, StrictMode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from 'stores/rootStore';
import { Button, Spinner } from 'components/Elements';
import { Notifications } from 'features/notifications';

const SuspenseFallback = (
  <div className="flex items-center justify-center w-screen h-screen">
    <Spinner size="lg" />
  </div>
);

const ErrorFallback = () => (
  <div
    className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
    role="alert"
  >
    <h2 className="text-lg font-semibold">
      Ooops, something went terribly wrong :(
    </h2>
    <Button
      className="mt-4 w-40"
      onClick={() => window.location.assign(window.location.href)}
    >
      Refresh
    </Button>
  </div>
);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ReduxProvider store={store}>
          {/* When you put ReduxProvider inside the Suspense */}
          {/* ALL HELL BREAKS LOOSE */}
          {/* https://www.reddit.com/r/reactjs/comments/yhiu25/comment/iuelrpd/?utm_source=share&utm_medium=web2x&context=3 */}
          <Suspense fallback={SuspenseFallback}>
            <Notifications />
            <Router>{children}</Router>
          </Suspense>
        </ReduxProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};
