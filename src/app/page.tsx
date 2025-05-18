import ProfileImage from "@/components/ProfileImage";
import Image from "next/image";
import NavigationButtons from "@/components/NavigationButtons";
import GreetingText from "@/components/GreetingText";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="h-screen w-full flex flex-col items-center px-4 py-6 justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center gap-16 max-w-3xl w-full mx-auto">
        <div className="flex flex-col items-center justify-center text-center gap-4">
        <ProfileImage />
        <GreetingText />
      </div>
        <NavigationButtons />
        <SearchBar />

      </div>
    </main>
  );
}
