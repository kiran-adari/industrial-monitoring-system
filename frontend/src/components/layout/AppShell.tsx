import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

type AppShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Live Sensors", to: "/dashboard" },
  { label: "Alerts", to: "/dashboard" },
  { label: "Analytics", to: "/dashboard" },
  { label: "Machines", to: "/dashboard" },
  { label: "Reports", to: "/dashboard" },
  { label: "System Health", to: "/dashboard" },
  { label: "Users", to: "/dashboard" },
  { label: "Settings", to: "/dashboard" },
];

export default function AppShell({
  title,
  subtitle,
  children,
}: AppShellProps) {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="flex">
        <aside className="hidden w-72 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 xl:block">
          <div className="border-b border-slate-200 p-6 dark:border-slate-800">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-500 dark:text-cyan-400">
              Industrial Monitoring
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Command Center</h2>
          </div>

          <nav className="space-y-2 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "block w-full rounded-2xl px-4 py-3 text-left transition",
                    isActive
                      ? "bg-cyan-50 text-cyan-700 dark:bg-slate-900 dark:text-cyan-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-left text-rose-500 transition hover:bg-rose-500/20 dark:text-rose-400"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-200 bg-white/80 px-6 py-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold">{title}</h1>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                  System Status: Operational
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-right dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-medium">{user?.name ?? "User"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.role ?? "Role"}
                  </p>
                </div>

                <button
                  onClick={toggleTheme}
                  className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
                </button>
              </div>
            </div>
          </header>

          <section className="p-6">{children}</section>
        </main>
      </div>
    </div>
  );
}