import { fontClassName } from "../config/fonts";
import Navbar from "../components/Navbar";

export default function Blog() {
  return (
    <div className={fontClassName}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Coming Soon</h1>
      </main>
    </div>
  );
}
