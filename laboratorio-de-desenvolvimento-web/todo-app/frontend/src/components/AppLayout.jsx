import { Link, Outlet, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive
    ? "bg-blue-100 text-blue-700"
    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
  }`;

export default function AppLayout({ loggedUser, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-6xl mx-auto mb-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to={loggedUser ? "/todos" : "/"}
              className="text-2xl font-bold text-gray-900"
            >
              ToDo
            </Link>

            {loggedUser && (
              <div className="flex items-center gap-1">
                <NavLink to="/todos" end className={navLinkClass}>
                  Board
                </NavLink>
                <NavLink to="/todos/list" className={navLinkClass}>
                  List
                </NavLink>
              </div>
            )}
          </div>


          {loggedUser && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Olá, {loggedUser.name}
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Sair
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}