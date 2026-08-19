"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useCallback, useEffect, useRef } from "react";

interface Store<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T | undefined;
  getServerSnapshot: () => T | undefined;
  setSnapshot: (newSnapshot: T | undefined) => void;
}

function createStore<T>(): Store<T> {
  let snapshot: T | undefined;
  const listeners = new Set<() => void>();

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => snapshot,
    setSnapshot: (newSnapshot: T | undefined) => {
      snapshot = newSnapshot;
      listeners.forEach((l) => l());
    },
  };
}

export function useSyncedState<T>(queryKey: unknown[], initialData: T) {
  const queryClient = useQueryClient();
  const storeRef = useRef<Store<T>>(createStore<T>());
  const store = storeRef.current;
  const keyString = queryKey.join();

  useEffect(() => {
    const cachedData = queryClient.getQueryData<T>(queryKey);
    store.setSnapshot(cachedData);

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey.join() === keyString) {
        const freshData = queryClient.getQueryData<T>(queryKey);
        store.setSnapshot(freshData);
      }
    });

    return unsubscribe;
  }, [queryClient, keyString, queryKey, store]);

  const data = useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot() ?? initialData,
    () => initialData
  );

  const setData = useCallback(
    (newData: T | ((prev: T) => T)) => {
      const current = store.getSnapshot() ?? initialData;
      store.setSnapshot(
        typeof newData === "function" ? (newData as (prev: T) => T)(current) : newData
      );
    },
    [store]
  );

  return [data, setData] as const;
}
