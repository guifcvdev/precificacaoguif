import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import DatabaseConnectionTest from './database/DatabaseConnectionTest';
import DatabaseMigrationTest from './database/DatabaseMigrationTest';
import DatabaseTableList from './database/DatabaseTableList';
import DatabaseUserTest from './database/DatabaseUserTest';
import { supabase } from '../lib/supabaseClient';

const DatabaseTestPanel: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatabaseConnectionTest
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTestResult={setTestResult}
        />
        
        <DatabaseMigrationTest
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTestResult={setTestResult}
        />
        
        <DatabaseTableList
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTestResult={setTestResult}
        />
      </div>

      <DatabaseUserTest
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setTestResult={setTestResult}
      />

      {testResult && (
        <Alert className={testResult.includes('❌') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertDescription>
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DatabaseTestPanel;
