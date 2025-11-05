"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  LogOut,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";
import LinkPage from "@/components/main/link-page";
import { UserDashboard } from "@/components/main/user-dashboard";
import HintComponent from "@/components/main/hint";
import { getUserProfile, clearUserData, clearSessionData } from "@/lib/api";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import NotesPage from '@/components/main/notes';
import ProgressTracker from '@/components/main/progress';

export default function MainPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bothAccountsLinked, setBothAccountsLinked] = useState(false);
  const [userData, setUserData] = useState({
    username: "User",
    email: "",
    userId: "",
  });

  const links = useMemo(
    () => [
      { label: "Dashboard", href: "#dashboard", icon: <LayoutDashboard className="h-5 w-5" />, onClick: () => setActiveSection("dashboard") },
      { label: "Hint", href: "#hint", icon: <Lightbulb className="h-5 w-5" />, onClick: () => setActiveSection("hint") },
      { label: "Progress", href: "#progress", icon: <TrendingUp className="h-5 w-5" />, onClick: () => setActiveSection("progress") },
      { label: "Notes", href: "#notes", icon: <FileText className="h-5 w-5" />, onClick: () => setActiveSection("notes") },
    ],
    []
  );

  // Check authentication and linked accounts
  useEffect(() => {
    const initAuth = async () => {
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");

      if (!userId) {
        clearSessionData();
        router.push("/auth?mode=login");
        return;
      }

      setUserData({
        username: username || "User",
        email: email || "",
        userId,
      });
      setIsAuthenticated(true);

      try {
        const profileData = await getUserProfile(userId);
        if (profileData.success && profileData.data) {
          const dbUser = profileData.data;
          const cfLinked = dbUser.accountsLinked?.hasCodeforces || false;
          const ccLinked = dbUser.accountsLinked?.hasCodechef || false;

          if (cfLinked && dbUser.codeforces?.handle) {
            localStorage.setItem("codeforces_handle", dbUser.codeforces.handle);
            localStorage.setItem("codeforces_linked", "true");
          } else {
            localStorage.removeItem("codeforces_handle");
            localStorage.removeItem("codeforces_linked");
          }

          if (ccLinked && dbUser.codechef?.handle) {
            localStorage.setItem("codechef_handle", dbUser.codechef.handle);
            localStorage.setItem("codechef_linked", "true");
          } else {
            localStorage.removeItem("codechef_handle");
            localStorage.removeItem("codechef_linked");
          }

          setBothAccountsLinked(cfLinked && ccLinked);
        } else {
          clearUserData();
          setBothAccountsLinked(false);
        }
      } catch (error) {
        console.error("Failed fetching user profile:", error);
        clearUserData();
        setBothAccountsLinked(false);
      }
      setIsLoading(false);
    };

    initAuth();
  }, [router]);

  const handleLogout = () => {
    clearSessionData();
    router.push("/auth?mode=login");
  };

  const handleBothLinked = () => {
    setBothAccountsLinked(true);
    setActiveSection("dashboard");
  };

  const renderContent = () => {
    if (!bothAccountsLinked)
      return (
        <LinkPage
          userId={userData.userId}
          userEmail={userData.email}
          onBothAccountsLinked={handleBothLinked}
        />
      );

    switch (activeSection) {
      case "dashboard":
        return <UserDashboard {...userData} />;
      case "hint":
        return <HintComponent />;
      case "chatbot":
        return <div className="flex-1 flex items-center justify-center">Chatbot Coming Soon</div>;
      case "progress":
        return <ProgressTracker />;
      case "notes":
        return <NotesPage />;
      default:
        return <UserDashboard {...userData} />;
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );

  if (!isAuthenticated) return null;

  return (
    <div className={cn("flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-neutral-900 overflow-hidden")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1">
            <div className={cn("flex", open ? "justify-start" : "justify-center")}> 
              <Logo size={32} hideText={!open} />
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, i) => (
                <div
                  key={i}
                  onClick={link.onClick}
                  className={cn(
                    "cursor-pointer rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800/50",
                    open ? "px-2 py-1" : "px-0 py-1"
                  )}
                >
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>
          <div onClick={handleLogout} className="cursor-pointer flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md px-2 py-1">
            <LogOut className="text-red-500 h-5 w-5" />
            {open && <span className="text-red-500 text-sm font-medium">Logout</span>}
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 p-4 relative border-l border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
