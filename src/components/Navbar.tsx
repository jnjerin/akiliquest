

export function Navbar() {
    return (
      <nav className="flex justify-between items-center py-4 px-6 shadow dark:shadow-none">
        <div className="text-2xl font-bold text-blue-600 dark:text-yellow-400">AkiliQuest</div>
        <div className="space-x-4">
          <a href="#" className="hover:text-blue-500 dark:hover:text-yellow-300">Explore</a>
          <a href="#" className="hover:text-blue-500 dark:hover:text-yellow-300">About</a>
          <a href="https://github.com" target="_blank" className="hover:text-blue-500 dark:hover:text-yellow-300">GitHub</a>
        </div>
      </nav>
    );
  }