import { useState } from "react";
import HomePage from "./sections/HomePage";
import WorkPage from "./sections/WorkPage";

// Main BoldFolio Component (Router)
export default function BoldFolio() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (currentPage === "work") {
    return <WorkPage onNavigate={handleNavigate} />;
  }

  return <HomePage onNavigate={handleNavigate} />;
}
