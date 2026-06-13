'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface OrderSessionContextType {
  tableId: string | null;
  sessionId: string | null;
  isValidTable: boolean | null;
  setTableId: (id: string) => void;
  setSessionId: (id: string) => void;
  validateTableAndSession: (table: string) => Promise<boolean>;
}

const OrderSessionContext = createContext<OrderSessionContextType | null>(null);

export function OrderSessionProvider({ children }: { children: React.ReactNode }) {
  const [tableId, setTableId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isValidTable, setIsValidTable] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTableId = sessionStorage.getItem('sugi_table_id');
    const savedSessionId = sessionStorage.getItem('sugi_session_id');

    if (savedTableId) setTableId(savedTableId);
    if (savedSessionId) setSessionId(savedSessionId);
  }, []);

  const saveTableId = (id: string) => {
    setTableId(id);
    sessionStorage.setItem('sugi_table_id', id);
  };

  const saveSessionId = (id: string) => {
    setSessionId(id);
    sessionStorage.setItem('sugi_session_id', id);
  };

  const validateTableAndSession = async (table: string) => {
    try {
      // 1. Validate Table
      const tableRes = await fetch(`/api/tables/${table}/validate`);
      if (!tableRes.ok) {
        setIsValidTable(false);
        return false;
      }
      
      setIsValidTable(true);
      saveTableId(table);

      // 2. Session Recovery Logic
      let currentSessionId = sessionStorage.getItem('sugi_session_id');

      if (currentSessionId) {
        // Validate existing session
        const sessionRes = await fetch(`/api/sessions/${currentSessionId}/validate`);
        const sessionData = await sessionRes.json();
        
        if (sessionData.valid) {
          saveSessionId(currentSessionId);
          return true; // Valid and open
        }
      }

      // 3. Check for any active session on this table
      const activeRes = await fetch(`/api/tables/${table}/active-session`);
      const activeData = await activeRes.json();

      if (activeData.hasSession) {
        saveSessionId(activeData.sessionId);
        return true;
      }

      // 4. Create new session
      const createRes = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: table })
      });
      
      if (createRes.ok) {
        const createData = await createRes.json();
        saveSessionId(createData.sessionId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  };

  return (
    <OrderSessionContext.Provider value={{
      tableId,
      sessionId,
      isValidTable,
      setTableId: saveTableId,
      setSessionId: saveSessionId,
      validateTableAndSession
    }}>
      {children}
    </OrderSessionContext.Provider>
  );
}

export function useOrderSession() {
  const ctx = useContext(OrderSessionContext);
  if (!ctx) throw new Error('useOrderSession must be used inside OrderSessionProvider');
  return ctx;
}
