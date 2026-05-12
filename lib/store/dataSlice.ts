"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Leave, RewardEvent, Task } from "@/types";
import { updateDataset } from "@/lib/mock/service";

interface DataState {
  optimisticVersion: number;
}

const initialState: DataState = { optimisticVersion: 0 };

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addLeave(state, action: PayloadAction<Leave>) {
      updateDataset((ds) => {
        ds.leaves.unshift(action.payload);
      });
      state.optimisticVersion += 1;
    },
    setLeaveStatus(state, action: PayloadAction<{ id: string; status: Leave["status"]; reviewedBy?: string }>) {
      updateDataset((ds) => {
        const l = ds.leaves.find((x) => x.id === action.payload.id);
        if (l) {
          l.status = action.payload.status;
          if (action.payload.reviewedBy) l.reviewedBy = action.payload.reviewedBy;
          l.reviewedAt = new Date().toISOString();
        }
      });
      state.optimisticVersion += 1;
    },
    updateTask(state, action: PayloadAction<{ id: string; patch: Partial<Task> }>) {
      updateDataset((ds) => {
        const t = ds.tasks.find((x) => x.id === action.payload.id);
        if (t) Object.assign(t, action.payload.patch);
      });
      state.optimisticVersion += 1;
    },
    addTask(state, action: PayloadAction<Task>) {
      updateDataset((ds) => ds.tasks.unshift(action.payload));
      state.optimisticVersion += 1;
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      updateDataset((ds) => {
        const n = ds.notifications.find((x) => x.id === action.payload);
        if (n) n.read = true;
      });
      state.optimisticVersion += 1;
    },
    markAllNotificationsRead(state) {
      updateDataset((ds) => ds.notifications.forEach((n) => (n.read = true)));
      state.optimisticVersion += 1;
    },
    awardReward(state, action: PayloadAction<RewardEvent>) {
      updateDataset((ds) => {
        ds.rewards.unshift(action.payload);
      });
      state.optimisticVersion += 1;
    },
    redeemGiftCard(state, action: PayloadAction<{ employeeId: string; cardId: string }>) {
      updateDataset((ds) => {
        const card = ds.giftCards.find((c) => c.id === action.payload.cardId);
        if (!card) return;
        ds.rewards.unshift({
          id: `rw_redeem_${Date.now()}`,
          employeeId: action.payload.employeeId,
          type: "gift_card",
          title: `Redeemed: ${card.title}`,
          description: "Voucher will be emailed within 5 minutes.",
          points: -card.pointsCost,
          valueINR: card.valueINR,
          awardedAt: new Date().toISOString(),
          awardedBy: "Self",
          icon: "Gift"
        });
      });
      state.optimisticVersion += 1;
    },
    bumpVersion(state) {
      state.optimisticVersion += 1;
    }
  }
});

export const {
  addLeave,
  setLeaveStatus,
  updateTask,
  addTask,
  markNotificationRead,
  markAllNotificationsRead,
  redeemGiftCard,
  awardReward,
  bumpVersion
} = dataSlice.actions;
export default dataSlice.reducer;
