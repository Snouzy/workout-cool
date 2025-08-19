import Link from "next/link";
import { ArrowLeft, UserX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-6">
            <UserX className="size-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            ${"This user doesn't exist, has set their profile to private, or the username might be incorrect."}
          </p>
        </div>

        <div className="space-y-4">
          <Link
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            href="/"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Looking for someone specific?</p>
            <p>Make sure the username is spelled correctly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
