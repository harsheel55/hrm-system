import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">404</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-base text-slate-300">
          The route you requested does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Go to home
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-slate-700 px-6 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
          >
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
