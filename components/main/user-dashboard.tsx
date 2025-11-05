"use client";
import React, { useState, useEffect } from "react";
import { Mail, Loader2, RefreshCw } from "lucide-react";
import { refreshCodeforcesData, refreshCodechefData } from "@/lib/api";

interface CodeforcesData {
  linked: boolean;
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
}

interface CodechefData {
  linked: boolean;
  handle: string;
  rating: number;
  maxRating: number;
  stars: number;
}

interface UserDashboardProps {
  username: string;
  email: string;
  userId: string;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  username,
  email,
  userId
}) => {
  const [codeforces, setCodeforces] = useState<CodeforcesData>({
    linked: false,
    handle: "",
    rating: 0,
    maxRating: 0,
    rank: ""
  });

  const [codechef, setCodechef] = useState<CodechefData>({
    linked: false,
    handle: "",
    rating: 0,
    maxRating: 0,
    stars: 0
  });

  const [loadingCodeforces, setLoadingCodeforces] = useState(true);
  const [loadingCodechef, setLoadingCodechef] = useState(true);
  const [errorCodeforces, setErrorCodeforces] = useState<string | null>(null);
  const [errorCodechef, setErrorCodechef] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

  // Fetch Codeforces data
  const fetchCodeforcesData = async () => {
    const savedHandle = localStorage.getItem('codeforces_handle');
    
    if (!savedHandle) {
      setLoadingCodeforces(false);
      return;
    }

    setErrorCodeforces(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/codeforces/${savedHandle}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.error) {
        setCodeforces({
          linked: true,
          handle: data.handle || savedHandle,
          rating: data.rating || 0,
          maxRating: data.max_rating || data.maxRating || 0,
          rank: data.rank || data.max_rank || "unrated"
        });
      } else {
        setErrorCodeforces(data.error);
      }
    } catch (error) {
      console.error('Codeforces fetch error:', error);
      setErrorCodeforces(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setLoadingCodeforces(false);
    }
  };

  // Fetch CodeChef data
  const fetchCodechefData = async () => {
    const savedHandle = localStorage.getItem('codechef_handle');
    
    if (!savedHandle) {
      setLoadingCodechef(false);
      return;
    }

    setErrorCodechef(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/codechef/${savedHandle}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.error) {
        setCodechef({
          linked: true,
          handle: data.handle || savedHandle,
          rating: parseInt(data.rating) || 0,
          maxRating: parseInt(data.max_rating) || 0,
          stars: parseInt(data.stars) || 0
        });
      } else {
        setErrorCodechef(data.error);
      }
    } catch (error) {
      console.error('CodeChef fetch error:', error);
      setErrorCodechef(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setLoadingCodechef(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchCodeforcesData();
    fetchCodechefData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    setLoadingCodeforces(true);
    setLoadingCodechef(true);

    // Refresh data from backend
    try {
      const [cfResult, ccResult] = await Promise.all([
        refreshCodeforcesData(userId),
        refreshCodechefData(userId)
      ]);

      if (cfResult.success) {
        console.log('Codeforces data refreshed');
      }
      if (ccResult.success) {
        console.log('Codechef data refreshed');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }

    // Re-fetch data to update UI
    await fetchCodeforcesData();
    await fetchCodechefData();
  };

  // Check if any account is linked
  const hasCodeforcesLinked = codeforces.linked || !!localStorage.getItem('codeforces_handle');
  const hasCodechefLinked = codechef.linked || !!localStorage.getItem('codechef_handle');
  const hasAnyLinkedAccount = hasCodeforcesLinked || hasCodechefLinked;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-3">
          <h2 className="text-4xl font-bold text-neutral-900 dark:text-white">
            Welcome, {username} 👋
          </h2>
          <button
            onClick={handleRefresh}
            disabled={loadingCodeforces || loadingCodechef}
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="Refresh data"
          >
            <RefreshCw 
              className={`w-5 h-5 text-neutral-600 dark:text-neutral-400 ${
                (loadingCodeforces || loadingCodechef) ? 'animate-spin' : ''
              }`} 
            />
          </button>
        </div>
        <div className="flex items-center justify-center text-neutral-600 dark:text-neutral-400">
          <Mail className="w-5 h-5 mr-2" />
          <p>{email}</p>
        </div>
        <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-400">
          Your Competitive Programming Dashboard
        </p>
      </div>

      {!hasAnyLinkedAccount && (
        <div className="text-center mb-8 p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
          <p className="text-amber-800 dark:text-amber-300">
            No accounts linked yet. Please link your accounts to see your dashboard.
          </p>
        </div>
      )}

      {/* Linked Account Cards */}
      <div className={`grid grid-cols-1 ${hasCodeforcesLinked && hasCodechefLinked ? 'md:grid-cols-2' : ''} gap-6 w-full max-w-4xl`}>
        {/* Codeforces Card - Only show if linked */}
        {hasCodeforcesLinked && (
        <div className="w-full bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 flex flex-col items-start hover:shadow-md transition-all">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3 text-lg">
              CF
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Codeforces
            </h3>
          </div>
          
          {loadingCodeforces ? (
            <div className="w-full flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-2" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading...</p>
            </div>
          ) : errorCodeforces ? (
            <div className="w-full py-4">
              <p className="text-red-500 text-sm mb-2">⚠️ {errorCodeforces}</p>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                Please check if the backend is running on port 8001
              </p>
            </div>
          ) : codeforces.linked ? (
            <div className="w-full p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <p>
                  <span className="font-medium text-neutral-900 dark:text-white">Handle:</span> {codeforces.handle}
                </p>
                <p>
                  <span className="font-medium text-neutral-900 dark:text-white">Rating:</span> {codeforces.rating}
                </p>
                <p>
                  <span className="font-medium text-neutral-900 dark:text-white">Max Rating:</span> {codeforces.maxRating}
                </p>
                <p>
                  <span className="font-medium text-neutral-900 dark:text-white">Rank:</span> {codeforces.rank}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Account not linked</p>
          )}
        </div>
        )}

        {/* CodeChef Card - Only show if linked */}
        {hasCodechefLinked && (
        <div className="w-full bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 flex flex-col items-start hover:shadow-md transition-all">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-amber-600 dark:bg-amber-700 rounded-full flex items-center justify-center text-white font-bold mr-3 text-lg">
              CC
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              CodeChef
            </h3>
          </div>
          
          {loadingCodechef ? (
            <div className="w-full flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mb-2" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading...</p>
            </div>
          ) : errorCodechef ? (
            <div className="w-full py-4">
              <p className="text-red-500 text-sm mb-2">⚠️ {errorCodechef}</p>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                Please check if the backend is running on port 8001
              </p>
            </div>
          ) : codechef.linked ? (
            <div className="w-full p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <p>
                  <span className="font-medium text-neutral-900 dark:text-white">Handle:</span> {codechef.handle}
                </p>
                <p>
                  <span className="font-medium text-neutral-900 dark:text-white">Rating:</span> {codechef.rating}
                </p>
                <p>
                  <span className="font-medium text-neutral-900 dark:text-white">Max Rating:</span> {codechef.maxRating}
                </p>
                <p>
                  <span className="font-medium text-neutral-900 dark:text-white">Stars:</span> {codechef.stars} ⭐
                </p>
              </div>
            </div>
          ) : (
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Account not linked</p>
          )}
        </div>
        )}
      </div>
    </div>
  );
};