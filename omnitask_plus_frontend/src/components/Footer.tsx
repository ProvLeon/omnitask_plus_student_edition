import { Link } from "react-router-dom"

const Footer = () => {
  return (
  <footer className="bg-gray-200 text-gray-700 body-fon fixed bottom-0 w-full dark:bg-black/15 dark:text-white">
    <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
      <p className="text-gray-500 text-sm text-center sm:text-left">© {new Date().getFullYear()} OmniTask+ —
        <a href="https://twitter.com/@omnitask" rel="noopener noreferrer" className="text-gray-600 ml-1" target="_blank">@omnitask</a>
      </p>
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
