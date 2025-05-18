import ProfileImage from "@/components/ProfileImage";
import Image from "next/image";
import NavigationButtons from "@/components/NavigationButtons";
import GreetingText from "@/components/GreetingText";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center space-y-50 max-w-3xl w-full mx-auto">
        <div className="flex flex-col items-center justify-center text-center space-y-20 max-w-3xl w-full mx-auto">
        <ProfileImage />
        <GreetingText />
      </div>
        <div className="flex flex-col items-center justify-center text-center space-y-10 max-w-3xl w-full mx-auto">
        <NavigationButtons />
        <SearchBar />
      </div>
      </div>
    </main>
  );
}
