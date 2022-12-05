import { useReducer, useRef, useEffect, useCallback } from "react";

type Status = "idle" | "loading" | "success" | "failed";

const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return { status: "loading" };
    case "success":
      return { status: "success", value: action.value };
    case "failed":
      return { status: "failed" };
    case "idle":
      return { status: "idle" };
  }
};

const useSafeDispatch = (unSafeDispatch) => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return useCallback(
    (...args) => (mounted.current ? unSafeDispatch(...args) : void 0),
    [unSafeDispatch]
  );
};

export const useAsync = (initialState = {}) => {
  const [value, unSafeDispatch] = useReducer(reducer, {
    status: "idle",
    value: null,
    ...initialState,
  });
  const safeDispatch = useSafeDispatch(unSafeDispatch);
  const run = useCallback(
    (asyncFunc) => {
      safeDispatch({ type: "loading" });
      asyncFunc.then((resolve) => {
        safeDispatch({ type: "success", value: resolve });
      });
      asyncFunc.catch((error) => {
        safeDispatch({ type: "failed" });
      });
    },
    [safeDispatch]
  );

  return { run, status: value.status, value: value.value };
};
