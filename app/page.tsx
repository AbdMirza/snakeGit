import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-200 text-black">
      <h1 className="text-4xl font-bold mb-6">🐍 Welcome to Snake Mania</h1>
      <Link href="/snake" className="bg-green-300 hover:bg-green-600 px-6 py-3 rounded text-lg font-medium">
        Start Game ▶️
      </Link>
    </div>
  )
}
