interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export async function login(email: string, password: string) {
  const API_URL = import.meta.env.VITE_SERVER_BASE;
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data;
}

export async function signup(userData: UserData) {
  const API_URL = import.meta.env.VITE_SERVER_BASE;
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data;
}
