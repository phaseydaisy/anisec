import { jikanApi, Anime } from "@/lib/jikan";
import Link from "next/link";
import Image from "next/image";

async function getTopAnime(): Promise<Anime[]> {
  try {
    const data = await jikanApi.getTopAnime(1, 12);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch top anime:", error);
    return [];
  }
}

async function getCurrentSeason(): Promise<Anime[]> {
  try {
    const data = await jikanApi.getCurrentSeason(1, 12);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch current season:", error);
    return [];
  }
}

export default async function Home() {
  const [topAnime, currentSeason] = await Promise.all([
    getTopAnime(),
    getCurrentSeason(),
  ]);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-500">AnimeStream</h1>
          <nav className="flex gap-6">
            <Link href="/" className="hover:text-purple-400">Home</Link>
            <Link href="/search" className="hover:text-purple-400">Search</Link>
            <Link href="/favorites" className="hover:text-purple-400">Favorites</Link>
            <Link href="/profile" className="hover:text-purple-400">Profile</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Watch Anime Online Free</h2>
          <p className="text-gray-300 text-lg mb-6">
            Stream your favorite anime in HD with no ads. Powered by Cloudflare CDN.
          </p>
          <Link 
            href="/search" 
            className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold"
          >
            Browse Anime
          </Link>
        </div>
      </section>

      {/* Current Season */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6">Currently Airing</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {currentSeason.map((anime) => (
              <Link key={anime.mal_id} href={`/anime/${anime.mal_id}`} className="group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                  <Image
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title_english || anime.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-purple-400">
                  {anime.title_english || anime.title}
                </h4>
                <p className="text-gray-400 text-xs mt-1">
                  {anime.score ? `★ ${anime.score}` : "N/A"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Anime */}
      <section className="py-12 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6">Top Anime</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {topAnime.map((anime) => (
              <Link key={anime.mal_id} href={`/anime/${anime.mal_id}`} className="group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                  <Image
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title_english || anime.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  {anime.score && (
                    <div className="absolute top-2 right-2 bg-purple-600 px-2 py-1 rounded text-sm font-bold">
                      ★ {anime.score}
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-purple-400">
                  {anime.title_english || anime.title}
                </h4>
                <p className="text-gray-400 text-xs mt-1">
                  {anime.type} • {anime.episodes ? `${anime.episodes} eps` : "Ongoing"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Powered by Jikan API • Hosted on Cloudflare</p>
          <p className="mt-2 text-sm">This is a demo project. Not affiliated with any streaming service.</p>
        </div>
      </footer>
    </main>
  );
}