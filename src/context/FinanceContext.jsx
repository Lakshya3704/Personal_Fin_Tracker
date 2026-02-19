import { createContext, useContext, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    where,
    onSnapshot,
    orderBy,
    serverTimestamp
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const FinanceContext = createContext();

export const useFinance = () => {
    return useContext(FinanceContext);
};

const financeReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.payload, loading: false };
        case 'SET_GOALS':
            return { ...state, goals: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

export const FinanceProvider = ({ children }) => {
    const { user } = useAuth();
    const [state, dispatch] = useReducer(financeReducer, {
        transactions: [],
        goals: [],
        loading: true,
        error: null
    });

    // Real-time listener for transactions & goals
    useEffect(() => {
        if (!user) {
            dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
            dispatch({ type: 'SET_GOALS', payload: [] });
            return;
        }

        // Transactions Query
        const qTransactions = query(
            collection(db, "transactions"),
            where("uid", "==", user.uid),
            orderBy("date", "desc")
        );

        const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
            let results = [];
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id });
            });
            dispatch({ type: 'SET_TRANSACTIONS', payload: results });
        }, (error) => {
            console.error(error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
        });

        // Goals Query
        const qGoals = query(
            collection(db, "goals"),
            where("uid", "==", user.uid)
        );

        const unsubGoals = onSnapshot(qGoals, (snapshot) => {
            let results = [];
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id });
            });
            dispatch({ type: 'SET_GOALS', payload: results });
        }, (error) => {
            console.error(error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
        });

        return () => {
            unsubTransactions();
            unsubGoals();
        };
    }, [user]);

    const addTransaction = async (transaction) => {
        try {
            if (!user) return;
            await addDoc(collection(db, "transactions"), {
                ...transaction,
                uid: user.uid,
                createdAt: serverTimestamp()
            });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await deleteDoc(doc(db, "transactions", id));
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        }
    };

    const addGoal = async (goal) => {
        try {
            if (!user) return;
            await addDoc(collection(db, "goals"), {
                ...goal,
                currentAmount: 0,
                uid: user.uid,
                createdAt: serverTimestamp()
            });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        }
    };

    const updateGoal = async (id, updates) => {
        try {
            if (!user) return;
            const goalRef = doc(db, "goals", id);
            await updateDoc(goalRef, updates);
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        }
    };

    const deleteGoal = async (id) => {
        try {
            if (!user) return;
            await deleteDoc(doc(db, "goals", id));
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        }
    };

    return (
        <FinanceContext.Provider value={{
            ...state,
            addTransaction,
            deleteTransaction,
            addGoal,
            updateGoal,
            deleteGoal
        }}>
            {children}
        </FinanceContext.Provider>
    );
};
