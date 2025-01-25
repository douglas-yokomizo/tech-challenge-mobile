import React, { createContext, useContext, useReducer } from "react";
import { Post } from "../types";

interface AppState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
}

type AppAction =
  | { type: "SET_POSTS"; payload: Post[] }
  | { type: "ADD_POSTS"; payload: Post[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "INCREMENT_PAGE" };

const initialState: AppState = {
  posts: [],
  isLoading: false,
  error: null,
  currentPage: 1,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => null });

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.payload };
    case "ADD_POSTS":
      return { ...state, posts: [...state.posts, ...action.payload] };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "INCREMENT_PAGE":
      return { ...state, currentPage: state.currentPage + 1 };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
