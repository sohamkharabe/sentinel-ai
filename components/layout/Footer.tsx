import { PROJECT_NAME, TAGLINE } from '../../lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">GI</div>
          <div>
            <div className="font-medium text-slate-800">{PROJECT_NAME}</div>
            <div className="text-xs">{TAGLINE}</div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 text-xs text-slate-500">
          <div>Ministry of Health &amp; Family Welfare — Government of India</div>
          <div className="mt-1">For authorised use. Data handled in accordance with applicable policies.</div>
        </div>
      </div>
    </footer>
  );
}
