// Zustand store file: store.js
import create from 'zustand';

const useStore = create((set) => ({
  formulas: [],
  saveFormula: (formula) => set((state) => ({ formulas: [...state.formulas, formula] })),
}));

export default useStore;
