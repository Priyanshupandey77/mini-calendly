import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav>
      <p>Mini Calendly</p>
      <p>{user?.name}</p>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
