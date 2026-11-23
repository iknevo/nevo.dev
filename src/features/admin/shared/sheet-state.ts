import { create } from "zustand";

type NewSheetState = {
  isOpen: boolean;
  openCount: number;
  onOpen: () => void;
  onClose: () => void;
};

type EditSheetState = {
  isOpen: boolean;
  id?: string;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const createNewSheetStore = () =>
  create<NewSheetState>((set) => ({
    isOpen: false,
    openCount: 0,
    onOpen: () => set((state) => ({ isOpen: true, openCount: state.openCount + 1 })),
    onClose: () => set({ isOpen: false }),
  }));

export const createEditSheetStore = () =>
  create<EditSheetState>((set) => ({
    isOpen: false,
    id: undefined,
    onOpen: (id) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false }),
  }));
