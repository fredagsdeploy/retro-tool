import React, { useState, createContext, useMemo, useContext } from "react";

interface DragContextValue<T> {
  item: T | null;
  setItem: (value: T | null) => void;
}

const DragContext = createContext<DragContextValue<{ id: string }>>({
  item: null,
  setItem: (item: any) => {},
});

export const DragContextProvider: React.FC = ({ children }) => {
  const [item, setItem] = useState<any | null>(null);

  return (
    <DragContext.Provider
      value={useMemo(() => ({ item, setItem }), [item, setItem])}
      children={children}
    />
  );
};

export const useDragContextState = () => useContext(DragContext);
