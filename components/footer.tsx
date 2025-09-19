export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-blue-600" aria-hidden />
            <span className="font-semibold text-lg text-gray-900">Porta</span>
          </div>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            On-demand coolie service connecting travelers and verified porters at stations, bus stands, and airports.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <a href="#features" className="hover:text-gray-900">
                Features
              </a>
            </li>
            <li>
              <a href="/admin" className="hover:text-gray-900">
                Admin Demo
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-gray-900">
                FAQ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Get the App</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600" id="download">
            <li>
              <a href="#" className="hover:text-gray-900">
                Download on iOS (soon)
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Get it on Android (soon)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Porta</span>
          <div className="flex gap-3">
            <a href="#" className="hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="hover:text-gray-900">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
