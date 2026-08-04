import { NAV_ITEMS, PROJECT_NAME } from '../../lib/constants';

export default function Navbar() {
  return (
    <header className="border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-700 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7M7 21h10" />
            </svg>
          </span>
          <span className="text-lg font-semibold">{PROJECT_NAME}</span>
        </a>

        <nav className="hidden md:flex items-center space-x-8 text-sm">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.href} className="text-slate-700 hover:text-blue-700">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="md:hidden">
          <a href="/dashboard" className="inline-flex items-center rounded-md bg-blue-700 px-3 py-2 text-white text-sm">Dashboard</a>
        </div>
      </div>
    </header>
  );
}
