import { Button } from "./ui/button";
import { useState } from "react";

import ContactScreen from "./ContactScreen";

const Welcome = () => {
  const [showPage, setShowPage] = useState(false);
  if (showPage) {
    return <ContactScreen />;
  }
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Welcome To Contact Application
      </h1>

      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
        onClick={() => setShowPage(true)}
      >
        Get Started
      </Button>
    </div>
  );
};

export default Welcome;
