import { useReducer, useEffect } from "react";
import { fetchRepoDetails, fetchIssues } from "../client";
import { Issue } from "../page";

interface State {
    repoTitle: string;
    issues: Issue[];
    loading: boolean;
    page: number;
    error: string | null;
}

type Action =
    | { type: "SET_INITIAL_DATA"; payload: { repoTitle: string; issues: Issue[] } }
    | { type: "LOAD_MORE_ISSUES"; payload: Issue[] }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string };

const initialState: State = {
    repoTitle: "",
    issues: [],
    loading: true,
    page: 1,
    error: null,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_INITIAL_DATA":
            return {
                ...state,
                repoTitle: action.payload.repoTitle,
                issues: action.payload.issues,
                loading: false,
            };
        case "LOAD_MORE_ISSUES":
            return {
                ...state,
                issues: [...state.issues, ...action.payload], // Append new issues
                page: state.page + 1,
                loading: false,
            };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

export const useIssues = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const repoTitle = await fetchRepoDetails();
                const issues = await fetchIssues(1);
                dispatch({ type: "SET_INITIAL_DATA", payload: { repoTitle, issues } });
            } catch {
                dispatch({ type: "SET_ERROR", payload: "Error fetching data" });
            }
        };

        fetchData();
    }, []);

    const loadMoreIssues = async () => {
        dispatch({ type: "SET_LOADING", payload: false });
        try {
            const moreIssues = await fetchIssues(state.page + 1);
            dispatch({ type: "LOAD_MORE_ISSUES", payload: moreIssues });
        } catch {
            dispatch({ type: "SET_ERROR", payload: "Error fetching more issues" });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    };

    return { ...state, loadMoreIssues };
};
