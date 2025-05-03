import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface SubscriptionState {
  isProcessing: boolean;
  error: string | null;
  sessionId: string | null;
  companyId: string | null;
  redirectPath: string | null;
  isSessionProcessed: boolean;
}

type SubscriptionAction =
  | { type: 'START_PROCESSING'; payload: { sessionId: string; companyId: string } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_REDIRECT_PATH'; payload: string }
  | { type: 'MARK_SESSION_PROCESSED' }
  | { type: 'RESET' };

const initialState: SubscriptionState = {
  isProcessing: false,
  error: null,
  sessionId: null,
  companyId: null,
  redirectPath: null,
  isSessionProcessed: false
};

const subscriptionReducer = (
  state: SubscriptionState,
  action: SubscriptionAction
): SubscriptionState => {
  switch (action.type) {
    case 'START_PROCESSING':
      return {
        ...state,
        isProcessing: true,
        sessionId: action.payload.sessionId,
        companyId: action.payload.companyId,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isProcessing: false
      };
    case 'SET_REDIRECT_PATH':
      return {
        ...state,
        redirectPath: action.payload
      };
    case 'MARK_SESSION_PROCESSED':
      return {
        ...state,
        isSessionProcessed: true,
        isProcessing: false
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const SubscriptionContext = createContext<{
  state: SubscriptionState;
  dispatch: React.Dispatch<SubscriptionAction>;
} | null>(null);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);

  return (
    <SubscriptionContext.Provider value={{ state, dispatch }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
