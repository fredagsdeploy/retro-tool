import { useEffect, useRef } from "react";

export const useLatest = <T extends any>(value: T) => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};
