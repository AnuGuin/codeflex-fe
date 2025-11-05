export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/users";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001";

/* ---------------------------- Utility Functions ---------------------------- */

export function clearUserData() {
  localStorage.removeItem("codeforces_handle");
  localStorage.removeItem("codechef_handle");
  localStorage.removeItem("codeforces_data");
  localStorage.removeItem("codechef_data");
  localStorage.removeItem("codeforces_linked");
  localStorage.removeItem("codechef_linked");
}

export function clearSessionData() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  clearUserData();
}

/* ---------------------------- Authentication ---------------------------- */

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  clearSessionData();

  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (result?.data?._id) {
    localStorage.setItem("userId", result.data._id);
    localStorage.setItem("username", result.data.username);
    localStorage.setItem("email", result.data.email);
  }
  return result;
}

export async function loginUser(data: { email: string; password: string }) {
  clearSessionData();

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (result?.data?._id) {
    localStorage.setItem("userId", result.data._id);
    localStorage.setItem("username", result.data.username);
    localStorage.setItem("email", result.data.email);
  }
  return result;
}

/* ---------------------------- User Profile ---------------------------- */

export async function getUserProfile(userId: string) {
  try {
    const res = await fetch(`${API_URL}/profile/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return {
        success: false,
        data: null,
        linkedAccounts: { codeforces: null, codechef: null },
      };
    }

    return await res.json();
  } catch {
    return {
      success: false,
      data: null,
      linkedAccounts: { codeforces: null, codechef: null },
    };
  }
}

/* ---------------------------- Linking APIs ---------------------------- */

export async function linkCodeforcesAccount(data: { userId: string; handle: string }) {
  try {
    const res = await fetch(`${API_URL}/link-codeforces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: data.userId,
        codeforcesHandle: data.handle,
      }),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Failed to link Codeforces account" };
  }
}

export async function linkCodechefAccount(data: { userId: string; handle: string }) {
  try {
    const res = await fetch(`${API_URL}/link-codechef`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: data.userId,
        codechefHandle: data.handle,
      }),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Failed to link Codechef account" };
  }
}

/* ---------------------------- Refresh APIs ---------------------------- */

export async function refreshCodeforcesData(userId: string) {
  try {
    const res = await fetch(`${API_URL}/refresh-codeforces/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch {
    return { success: false, error: "Failed to refresh Codeforces data" };
  }
}

export async function refreshCodechefData(userId: string) {
  try {
    const res = await fetch(`${API_URL}/refresh-codechef/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch {
    return { success: false, error: "Failed to refresh Codechef data" };
  }
}

/* ---------------------------- Unlink APIs ---------------------------- */

export async function unlinkCodeforcesAccount(userId: string) {
  const res = await fetch(`${API_URL}/unlink-codeforces/${userId}`, {
    method: "DELETE",
  });
  return await res.json();
}

export async function unlinkCodechefAccount(userId: string) {
  const res = await fetch(`${API_URL}/unlink-codechef/${userId}`, {
    method: "DELETE",
  });
  return await res.json();
}


/* ---------------------------- NEW PROFILE FETCH FOR PYTHON BACKEND ---------------------------- */

export async function fetchUserPlatformProfile(platform: "codeforces" | "codechef", username: string) {
  const res = await fetch(`${API_BASE_URL}/api/profile/${platform}/${username}`);
  return await res.json();
}