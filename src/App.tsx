import React from 'react';
import './App.scss';
import { DataTable } from './components/DataTable/DataTable';

export const App: React.FC = () => {
  return (
    <div className="app">
      <DataTable />
    </div>
  );
};
