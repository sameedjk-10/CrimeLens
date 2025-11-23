import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "police" | "user" | null;

interface CurrentRoleState {
  role: UserRole;
  roleLoaded: boolean;
}

const initialState: CurrentRoleState = {
  role: null,
  roleLoaded: false,
};

export const currentRoleSlice = createSlice({
  name: "currentRole",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
      state.roleLoaded = true;
    },
    clearRole: (state) => {
      state.role = "user";
      state.roleLoaded = false;
    },
  },
});


export const { setRole, clearRole } = currentRoleSlice.actions;
export default currentRoleSlice.reducer;
