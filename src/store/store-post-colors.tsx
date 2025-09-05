import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ColorConfig {
  /** Cor principal em formato hex */
  primary: string;
  /** Cor de fundo em formato hex */
  background: string;
  /** Cor do texto principal em formato hex */
  textPrimary: string;
  /** Cor do texto secundário em formato hex */
  textSecondary: string;
  /** Cor do texto terciário em formato hex */
  textTertiary: string;
}

// Configuração inicial de cores
const INITIAL_COLORS: ColorConfig = {
  primary: "#8921C9",
  background: "#07041E",
  textPrimary: "#FFFFFF",
  textSecondary: "#FFFFFF",
  textTertiary: "#FFFFFF",
};

interface PostColorsStore {
  colors: ColorConfig;
  setColor: (colorKey: keyof ColorConfig, value: string) => void;
  setColors: (colors: ColorConfig) => void;
  resetColors: () => void;
}

export const usePostColorsStore = create<PostColorsStore>()(
  persist(
    (set) => ({
      colors: INITIAL_COLORS,
      
      setColor: (colorKey, value) =>
        set((state) => ({
          colors: {
            ...state.colors,
            [colorKey]: value,
          },
        })),
      
      setColors: (colors) => set({ colors }),
      
      resetColors: () => set({ colors: INITIAL_COLORS }),
    }),
    {
      name: "post-colors-storage",
      version: 1,
    }
  )
);
