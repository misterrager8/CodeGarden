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

export const SectionContext = createContext();

export default function Display({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [currentSection, setCurrentSection] = useState(
    localStorage.getItem("code-garden-section")
  );

  const sections = [
    { label: "changes-history", element: <Container /> },
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
        <Nav className="border-bottom pb-3" />
        {multiCtx?.currentRepo && (
          <>
            {!currentSection ? (
              <div className="row mt-3 main">
                <div className="col-3 border-end">
                  <Container />
                  <hr />
                  <Todos />
                </div>
                <div className="col-7 border-end">
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
