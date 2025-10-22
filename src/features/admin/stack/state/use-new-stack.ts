import { create } from "zustand";

type NewStackState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewStack = create<NewStackState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
