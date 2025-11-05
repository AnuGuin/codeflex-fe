'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { linkCodeforcesAccount, linkCodechefAccount, getUserProfile, clearUserData } from '@/lib/api';

interface Status {
  type: 'success' | 'error';
  message: string;
}

interface LinkPageProps {
  userId?: string;
  userEmail?: string;
  onBothAccountsLinked?: () => void;
}

export default function LinkPage({ userId, onBothAccountsLinked }: LinkPageProps = {}) {
  const [codeforcesHandle, setCodeforcesHandle] = useState('');
  const [codechefHandle, setCodechefHandle] = useState('');
  const [loadingCodeforces, setLoadingCodeforces] = useState(false);
  const [loadingCodechef, setLoadingCodechef] = useState(false);
  const [codeforcesStatus, setCodeforcesStatus] = useState<Status | null>(null);
  const [codechefStatus, setCodechefStatus] = useState<Status | null>(null);
  const [codeforcesLinked, setCodeforcesLinked] = useState(false);
  const [codechefLinked, setCodechefLinked] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

  /* -------------------------------------------------------------------------- */
  /*                       Clear stale data on new user                         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    clearUserData(); // Reset all linked handles when user changes
  }, [userId]);

  /* -------------------------------------------------------------------------- */
  /*                 Load any already linked accounts from DB                   */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const loadExistingAccounts = async () => {
      if (!userId) {
        setInitialLoadDone(true);
        return;
      }

      try {
        const profileData = await getUserProfile(userId);

        if (profileData.success && profileData.data) {
          const dbUser = profileData.data;

          if (dbUser.accountsLinked?.hasCodeforces && dbUser.codeforces?.handle) {
            setCodeforcesHandle(dbUser.codeforces.handle);
            setCodeforcesLinked(true);
            setCodeforcesStatus({ type: 'success', message: 'Already connected' });
            localStorage.setItem('codeforces_handle', dbUser.codeforces.handle);
            localStorage.setItem('codeforces_linked', 'true');
          }

          if (dbUser.accountsLinked?.hasCodechef && dbUser.codechef?.handle) {
            setCodechefHandle(dbUser.codechef.handle);
            setCodechefLinked(true);
            setCodechefStatus({ type: 'success', message: 'Already connected' });
            localStorage.setItem('codechef_handle', dbUser.codechef.handle);
            localStorage.setItem('codechef_linked', 'true');
          }
        }
      } catch (error) {
        console.error('Error loading existing accounts:', error);
      } finally {
        setInitialLoadDone(true);
      }
    };

    loadExistingAccounts();
  }, [userId]);

  /* -------------------------------------------------------------------------- */
  /*                   Handle Codeforces account linking                        */
  /* -------------------------------------------------------------------------- */
  const handleCodeforcesConnect = async () => {
    if (!codeforcesHandle.trim()) {
      setCodeforcesStatus({ type: 'error', message: 'Please enter a username' });
      return;
    }

    if (!userId) {
      setCodeforcesStatus({ type: 'error', message: 'User ID not found. Please login again.' });
      return;
    }

    setLoadingCodeforces(true);
    setCodeforcesStatus(null);

    try {
      const profileResponse = await fetch(`${API_BASE_URL}/api/profile/codeforces/${codeforcesHandle}`);
      if (!profileResponse.ok) throw new Error('Failed to fetch profile');
      const profileData = await profileResponse.json();
      if (profileData.error) throw new Error(profileData.error);

      const linkResult = await linkCodeforcesAccount({ userId, handle: codeforcesHandle });
      if (!linkResult.success) throw new Error(linkResult.error || 'Failed to link account');

      setCodeforcesLinked(true);
      setCodeforcesStatus({ type: 'success', message: `Connected successfully!` });
      localStorage.setItem('codeforces_handle', codeforcesHandle);
      localStorage.setItem('codeforces_linked', 'true');

      if (codechefLinked && onBothAccountsLinked) {
        setTimeout(() => onBothAccountsLinked(), 1000);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error:', errorMessage);
      setCodeforcesStatus({
        type: 'error',
        message: errorMessage || 'Failed to connect. Please check your username.',
      });
    } finally {
      setLoadingCodeforces(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                     Handle CodeChef account linking                        */
  /* -------------------------------------------------------------------------- */
  const handleCodechefConnect = async () => {
    if (!codechefHandle.trim()) {
      setCodechefStatus({ type: 'error', message: 'Please enter a username' });
      return;
    }

    if (!userId) {
      setCodechefStatus({ type: 'error', message: 'User ID not found. Please login again.' });
      return;
    }

    setLoadingCodechef(true);
    setCodechefStatus(null);

    try {
      const profileResponse = await fetch(`${API_BASE_URL}/api/profile/codechef/${codechefHandle}`);
      if (!profileResponse.ok) throw new Error('Failed to fetch profile');
      const profileData = await profileResponse.json();
      if (profileData.error) throw new Error(profileData.error);

      const linkResult = await linkCodechefAccount({ userId, handle: codechefHandle });
      if (!linkResult.success) throw new Error(linkResult.error || 'Failed to link account');

      setCodechefLinked(true);
      setCodechefStatus({ type: 'success', message: `Connected successfully!` });
      localStorage.setItem('codechef_handle', codechefHandle);
      localStorage.setItem('codechef_linked', 'true');

      if (codeforcesLinked && onBothAccountsLinked) {
        setTimeout(() => onBothAccountsLinked(), 1000);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error:', errorMessage);
      setCodechefStatus({
        type: 'error',
        message: errorMessage || 'Failed to connect. Please check your username.',
      });
    } finally {
      setLoadingCodechef(false);
    }
  };

  const bothAccountsLinked = codeforcesLinked && codechefLinked;

  if (!initialLoadDone) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Loading your accounts...</p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                              UI RENDERING                                  */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 md:p-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3">Link Your Accounts</h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
          Connect your competitive programming profiles to continue
        </p>
      </div>

      <div className="mb-6 w-full max-w-5xl">
        <Alert
          className={
            bothAccountsLinked
              ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
              : 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
          }
        >
          <div className="flex items-start">
            {bothAccountsLinked ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
            )}
            <AlertDescription
              className={
                bothAccountsLinked
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-blue-800 dark:text-blue-300'
              }
            >
              {bothAccountsLinked ? (
                <span className="font-semibold">
                  ✓ Both accounts linked successfully! Redirecting to your dashboard...
                </span>
              ) : (
                <>
                  <strong>Required:</strong> Link both <strong>Codeforces</strong> and{' '}
                  <strong>CodeChef</strong> to proceed.
                </>
              )}
            </AlertDescription>
          </div>
        </Alert>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Codeforces Card */}
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all">
          <div className="flex items-center mb-5">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4 text-lg">
              CF
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">Codeforces</h2>
            {codeforcesLinked && <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />}
          </div>

          <Label htmlFor="codeforces-username" className="text-sm font-medium mb-2 block">
            Username
          </Label>
          <Input
            id="codeforces-username"
            type="text"
            placeholder="Enter your Codeforces handle"
            value={codeforcesHandle}
            onChange={(e) => setCodeforcesHandle(e.target.value)}
            disabled={loadingCodeforces || codeforcesLinked}
            className="mb-3"
          />
          {!codeforcesLinked && (
            <Button
              onClick={handleCodeforcesConnect}
              disabled={loadingCodeforces || !codeforcesHandle.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loadingCodeforces ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                </>
              ) : (
                'Connect Account'
              )}
            </Button>
          )}
          {codeforcesStatus && (
            <Alert
              className={
                codeforcesStatus.type === 'success'
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30 mt-3'
                  : 'border-red-500 bg-red-50 dark:bg-red-950/30 mt-3'
              }
            >
              <AlertDescription
                className={
                  codeforcesStatus.type === 'success'
                    ? 'text-green-800 dark:text-green-300'
                    : 'text-red-800 dark:text-red-300'
                }
              >
                {codeforcesStatus.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* CodeChef Card */}
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all">
          <div className="flex items-center mb-5">
            <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold mr-4 text-lg">
              CC
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">CodeChef</h2>
            {codechefLinked && <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />}
          </div>

          <Label htmlFor="codechef-username" className="text-sm font-medium mb-2 block">
            Username
          </Label>
          <Input
            id="codechef-username"
            type="text"
            placeholder="Enter your CodeChef handle"
            value={codechefHandle}
            onChange={(e) => setCodechefHandle(e.target.value)}
            disabled={loadingCodechef || codechefLinked}
            className="mb-3"
          />
          {!codechefLinked && (
            <Button
              onClick={handleCodechefConnect}
              disabled={loadingCodechef || !codechefHandle.trim()}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {loadingCodechef ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                </>
              ) : (
                'Connect Account'
              )}
            </Button>
          )}
          {codechefStatus && (
            <Alert
              className={
                codechefStatus.type === 'success'
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30 mt-3'
                  : 'border-red-500 bg-red-50 dark:bg-red-950/30 mt-3'
              }
            >
              <AlertDescription
                className={
                  codechefStatus.type === 'success'
                    ? 'text-green-800 dark:text-green-300'
                    : 'text-red-800 dark:text-red-300'
                }
              >
                {codechefStatus.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
