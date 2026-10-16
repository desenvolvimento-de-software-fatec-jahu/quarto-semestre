import { Link, Outlet } from "react-router-dom";

export default function AppLayout({ loggedUser, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-3xl mx-auto mb-8">
        <nav className="flex items-center justify-between">
          <Link
            to={loggedUser ? "/todos" : "/"}
            className="text-2xl font-bold text-gray-900"
          >
            ToDo
          </Link>

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

      <main className="max-w-3xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}