import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../MultiContext";
import Nav from "../organisms/Nav";
import Readme from "./Readme";
import Stashes from "./Stashes";
import Ignored from "./Ignored";
import Todos from "./Todos";
import Branches from "./Branches";
import Container from "./ChangesAndHistory/Container";
import Config from "./Config";
import Changes from "./ChangesAndHistory/Changes";
import History from "./ChangesAndHistory/History";

export const SectionContext = createContext();

export default function Display({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [currentSection, setCurrentSection] = useState(
    localStorage.getItem("code-garden-section")
  );

  const sections = [
    { label: "changes", element: <Changes /> },
    { label: "history", element: <History /> },
    { label: "todos", element: <Todos /> },
    { label: "readme", element: <Readme /> },
    { label: "stashes", element: <Stashes /> },
    { label: "ignored", element: <Ignored /> },
    { label: "branches", element: <Branches /> },
    { label: "config", element: <Config /> },
  ];

  const isCurrentSection = (label) => currentSection === label;

  useEffect(() => {
    currentSection
      ? localStorage.setItem("code-garden-section", currentSection)
      : localStorage.removeItem("code-garden-section");
  }, [currentSection]);

  const contextValue = {
    currentSection: currentSection,
    setCurrentSection: setCurrentSection,
    isCurrentSection: isCurrentSection,
  };

  return (
    <div className={className}>
      <SectionContext value={contextValue}>
        <Nav />
        <div className="p-4">
          {multiCtx?.currentRepo && (
            <div>
              {sections.find((x) => x.label === currentSection)?.element}
            </div>
          )}
        </div>
      </SectionContext>
    </div>
  );
}
