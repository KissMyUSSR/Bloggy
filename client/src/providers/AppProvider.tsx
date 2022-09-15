import { Suspense, ReactNode, StrictMode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import store from 'stores/globalStore';
import { Button, Spinner } from 'components/Elements';

const SuspenseFallback = (
  <div className="flex items-center justify-center w-screen h-screen">
    <Spinner size="xl" />
  </div>
);

const ErrorFallback = () => (
  <div
    className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
    role="alert"
  >
    <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
    <Button
      className="mt-4"
      onClick={() => window.location.assign(window.location.origin)}
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
      <Suspense fallback={SuspenseFallback}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ReduxProvider store={store}>
            <Router>{children}</Router>
          </ReduxProvider>
        </ErrorBoundary>
      </Suspense>
    </StrictMode>
  );
};