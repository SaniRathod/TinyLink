import "../styles/globals.css";

export const metadata = { title: "TinyLink" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <header className="bg-white shadow p-4">
          <div className="container mx-auto">
            <h1 className="text-xl font-semibold">TinyLink</h1>
          </div>
        </header>
        <main className="container mx-auto p-4 flex-1">{children}</main>
        <footer className="text-center p-4 text-sm text-gray-500">TinyLink • Built for assignment</footer>
      </body>
    </html>
  );
}
