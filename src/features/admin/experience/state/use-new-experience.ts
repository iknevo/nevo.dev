import { create } from "zustand";

type NewExpState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewExperience = create<NewExpState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
