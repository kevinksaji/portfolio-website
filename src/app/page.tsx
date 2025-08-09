import ProfileImage from "@/components/ProfileImage";
import NavigationButtons from "@/components/NavigationButtons";
import GreetingText from "@/components/GreetingText";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="h-screen w-full flex flex-col items-center px-4 py-6 justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center gap-16 w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <ProfileImage />
          <GreetingText />
        </div>
        <NavigationButtons />
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>
      </div>
    </main>
  );
}
