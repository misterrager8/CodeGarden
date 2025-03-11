import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../MultiContext";
import Nav from "../organisms/Nav";
import Readme from "./Readme";
import Stashes from "./Stashes";
import Ignored from "./Ignored";
import ChangesAndHistory from "./ChangesAndHistory";
import Todos from "./Todos";
import Branches from "./Branches";

export const SectionContext = createContext();

export default function Display({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [currentSection, setCurrentSection] = useState(
    localStorage.getItem("code-garden-section")
  );

  const sections = [
    { label: "changes-history", element: <ChangesAndHistory /> },
    { label: "todos", element: <Todos /> },
    { label: "readme", element: <Readme /> },
    { label: "stashes", element: <Stashes /> },
    { label: "ignored", element: <Ignored /> },
    { label: "branches", element: <Branches /> },
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
        <Nav className="mb-4" />
        {multiCtx?.currentRepo && (
          <>
            {!currentSection ? (
              <div className="row mt-3 main">
                <div className="col-3">
                  <ChangesAndHistory />
                  <hr />
                  <Todos />
                </div>
                <div className="col-7">
                  <Readme />
                </div>
                <div className="col-2">
                  <Stashes />
                  <hr />
                  <Ignored />
                </div>
              </div>
            ) : (
              <div>
                {sections.find((x) => x.label === currentSection).element}
              </div>
            )}
          </>
        )}
      </SectionContext>
    </div>
  );
}
