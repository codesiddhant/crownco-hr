"use client";

import { useDispatch, useSelector, useStore, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./index";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => ReturnType<typeof useStore<RootState>> = useStore;
