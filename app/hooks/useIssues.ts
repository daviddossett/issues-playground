import { useReducer, useEffect } from "react";
import { fetchIssues } from "../client";
import { Issue, Repo } from "../page";

interface State {
    repo: Repo;
    issues: Issue[];
    loading: boolean;
    page: number;
    error: string | null;
    hasMore: boolean; // Add this line
}

type Action =
    | { type: "SET_INITIAL_DATA"; payload: { repo: Repo; issues: Issue[], hasMore: boolean } }
    | { type: "LOAD_MORE_ISSUES"; payload: { issues: Issue[], hasMore: boolean } }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string };

const initialState: State = {
    repo: { name: "", owner: "" },
    issues: [],
    loading: true,
    page: 1,
    error: null,
    hasMore: true, // Add this line
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_INITIAL_DATA":
            return {
                ...state,
                repo: action.payload.repo,
                issues: action.payload.issues,
                loading: false,
                hasMore: action.payload.hasMore, // Update this line
            };
        case "LOAD_MORE_ISSUES":
            return {
                ...state,
                issues: [...state.issues, ...action.payload.issues], // Append new issues
                page: state.page + 1,
                loading: false,
                hasMore: action.payload.hasMore, // Update this line
            };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

export const useIssues = (repo: Repo) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchData = async (repo: Repo) => {
            dispatch({ type: "SET_LOADING", payload: true }); // Set loading to true
            try {
                const { issues, hasMore } = await fetchIssues(repo, 1);
                dispatch({ type: "SET_INITIAL_DATA", payload: { repo, issues, hasMore } });
            } catch {
                dispatch({ type: "SET_ERROR", payload: "Error fetching data" });
            }
        };

        fetchData(repo);
    }, [repo]);

    const loadMoreIssues = async () => {
        try {
            const { issues, hasMore } = await fetchIssues(state.repo, state.page + 1);
            dispatch({ type: "LOAD_MORE_ISSUES", payload: { issues, hasMore } });
        } catch {
            dispatch({ type: "SET_ERROR", payload: "Error fetching more issues" });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    };

    return { ...state, loadMoreIssues };
};
