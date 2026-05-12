import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Role, User } from "@/types";

interface AuthState {
  user: User | null;
  role: Role;
  authenticated: boolean;
}

const defaultUser: User = {
  id: "u_demo_hr",
  name: "Ananya Sharma",
  email: "ananya.sharma@crownco.ai",
  avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ananya-sharma&radius=50",
  role: "hr_admin",
  employeeId: "EMP-0001"
};

const initialState: AuthState = {
  user: defaultUser,
  role: "hr_admin",
  authenticated: true
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; role: Role }>) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.authenticated = true;
    },
    logout(state) {
      state.user = null;
      state.authenticated = false;
    },
    setRole(state, action: PayloadAction<Role>) {
      state.role = action.payload;
      if (state.user) state.user.role = action.payload;
    }
  }
});

export const { login, logout, setRole } = authSlice.actions;
export default authSlice.reducer;
