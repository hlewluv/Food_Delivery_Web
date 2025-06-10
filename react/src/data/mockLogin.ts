// Mock user data
const mockUsers = [
  {
    username: "host1",
    password: "password123",
    role: "Host",
  },
  {
    username: "admin1",
    password: "admin123",
    role: "Admin",
  },
];

// Mock login function
export const login = async ({ username, password }: { username: string; password: string }) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Find user in mock data
  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
  }

  // Store role in localStorage
  localStorage.setItem("role", user.role);

  return {
    message: "Đăng nhập thành công",
    role: user.role,
  };
};