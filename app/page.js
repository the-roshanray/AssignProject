export default function Home() {
  return (
    <main className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Project Tracker</h1>
      <p className="text-lg text-gray-600">
        Manage projects, track progress, and calculate scores dynamically.
      </p>
      <div className="mt-6 space-x-4">
        <a
          href="/admin"
          className="px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Admin Panel
        </a>
        <a
          href="/candidate-login"
          className="px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600"
        >
          Candidate Panel
        </a>
      </div>
    </main>
  );
}
