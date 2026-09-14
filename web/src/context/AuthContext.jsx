import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const MOCK_USERS = {
  farmer: {
    id: 'USR-FARM-9942',
    name: 'Rajesh Dashrath Patil',
    role: 'farmer',
    roleLabel: 'Farmer Producer (FPO)',
    apmc: 'Nashik APMC, MH',
    phone: '+91 98231 44210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  },
  apmc: {
    id: 'USR-APMC-014',
    name: 'Sanjay Deshmukh (Secretary)',
    role: 'apmc',
    roleLabel: 'APMC Mandi Yard Official',
    apmc: 'Pimpalgaon Baswant APMC',
    phone: '+91 94220 18400',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  },
  buyer: {
    id: 'USR-BUYER-882',
    name: 'Vikram Mehta (Procurement Lead)',
    role: 'buyer',
    roleLabel: 'Institutional Buyer (Maharshi Agro)',
    apmc: 'APEDA Nashik / Mumbai',
    phone: '+91 98200 55100',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  },
  driver: {
    id: 'USR-DRV-331',
    name: 'Dnyaneshwar Shinde',
    role: 'driver',
    roleLabel: 'Logistics Drayage Driver',
    apmc: 'Khanderao Transport Syndicate',
    phone: '+91 98233 11204',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
  },
  public: {
    id: 'USR-PUBLIC-000',
    name: 'Visitor / Unauthenticated',
    role: 'public',
    roleLabel: 'Public Visitor',
    apmc: 'Guest Gateway',
    phone: '',
    avatar: '',
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('agrisync_role');
    return MOCK_USERS[savedRole] || MOCK_USERS.farmer;
  });

  const [language, setLanguage] = useState('EN');

  const switchRole = (newRole) => {
    if (MOCK_USERS[newRole]) {
      setUser(MOCK_USERS[newRole]);
      localStorage.setItem('agrisync_role', newRole);
    }
  };

  return (
    <AuthContext.Provider value={{ user, switchRole, language, setLanguage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
