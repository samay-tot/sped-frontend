import { useLayoutEffect, useRef } from "react";
import { NavigateFunction } from "react-router-dom";

export const useWillMountHook = (callback: () => void) => {
  const didMount = useRef<boolean>(false);

  useLayoutEffect(() => {
    if (callback && !didMount.current) {
      didMount.current = true;
      callback();
    }
  }, [callback]);
};

export const navigateToRoute = (
  navigate: NavigateFunction,
  route: string,
  isReplace = false
) => {
  navigate(route, { replace: isReplace });
};

export interface ErrorResponse {
  response?: {
    data?: {
      data?: {
        message?: string;
      };
    };
  };
}
