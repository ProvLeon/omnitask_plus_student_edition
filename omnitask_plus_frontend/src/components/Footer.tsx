import { Link } from "react-router-dom"

// Footer component for the application
const Footer = () => {
  return (
    // Footer styling with conditional classes for light and dark mode
    <footer className="bg-gray-200 text-gray-700 body-font w-full dark:bg-black/15 dark:text-white mt-auto">
      <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
        {/* // Copyright notice with dynamic year and link to Twitter */}
        <p className="text-gray-500 text-sm text-center sm:text-left">© {new Date().getFullYear()} OmniTask+ —
          <a href="https://twitter.com/@omnitask" rel="noopener noreferrer" className="text-gray-600 ml-1" target="_blank">@omnitask</a>
        </p>
        {/* // Navigation links for Home, About, and Contact pages */}
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
          <Link to="/" className="ml-4 text-gray-500">
            Home
          </Link>
          <Link to="/about" className="ml-4 text-gray-500">
            About
          </Link>
          <Link to="/contact" className="ml-4 text-gray-500">
            Contact
          </Link>
        </span>
      </div>
    </footer>
  )
}

export default Footer
