import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
      <h1 className="text-5xl font-bold text-gray-800 dark:text-white">404</h1>
      <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
      >
        Go back home
      </Link>
    </div>
  );
}
