import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  notificationsOpen: boolean;
  aiOpen: boolean;
  branchId: string | null;
  shortcutsOpen: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  commandOpen: false,
  notificationsOpen: false,
  aiOpen: false,
  branchId: null,
  shortcutsOpen: false
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebar(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setCommandOpen(state, action: PayloadAction<boolean>) {
      state.commandOpen = action.payload;
    },
    setNotificationsOpen(state, action: PayloadAction<boolean>) {
      state.notificationsOpen = action.payload;
    },
    setAiOpen(state, action: PayloadAction<boolean>) {
      state.aiOpen = action.payload;
    },
    setBranch(state, action: PayloadAction<string | null>) {
      state.branchId = action.payload;
    },
    setShortcutsOpen(state, action: PayloadAction<boolean>) {
      state.shortcutsOpen = action.payload;
    }
  }
});

export const {
  toggleSidebar,
  setSidebar,
  setCommandOpen,
  setNotificationsOpen,
  setAiOpen,
  setBranch,
  setShortcutsOpen
} = uiSlice.actions;
export default uiSlice.reducer;
