import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../MultiContext";
import markdownit from "markdown-it";
import Button from "../atoms/Button";
import { SectionContext } from "./Display";
import ButtonGroup from "../molecules/ButtonGroup";

export default function Readme({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [mode, setMode] = useState("read");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);

  const sxnCtx = useContext(SectionContext);
  const label = "readme";

  const onChangeContent = (e) => setContent(e.target.value);

  useEffect(() => {
    setContent(multiCtx.currentRepo.readme);
  }, [multiCtx.currentRepo]);

  return (
    <div
      className={
        className + (sxnCtx.isCurrentSection(label) ? " w-75 mx-auto" : "")
      }>
      <div
        className={
          "between mb-3" + (sxnCtx.isCurrentSection(label) ? " mt-3" : "")
        }>
        <ButtonGroup>
          <Button
            border={false}
            className="flex-grow-0"
            icon={
              sxnCtx.isCurrentSection(label)
                ? "fullscreen-exit"
                : "arrows-fullscreen"
            }
            onClick={() =>
              sxnCtx.setCurrentSection(
                sxnCtx.isCurrentSection(label) ? null : label
              )
            }
          />
          <Button
            icon={mode === "write" ? "eye" : "pencil"}
            text={mode === "write" ? "View" : "Edit"}
            onClick={() => setMode(mode === "read" ? "write" : "read")}
          />
        </ButtonGroup>
        {mode === "write" && (
          <Button
            onClick={() => {
              multiCtx.editReadme(content);
              setSaved(true);
              setTimeout(() => setSaved(false), 1500);
            }}
            className="green ms-3"
            icon={saved ? "check-lg" : "floppy2"}
          />
        )}
      </div>
      <div style={{ height: "79vh", overflowY: "auto" }}>
        {mode === "read" ? (
          <div
            id="readme"
            dangerouslySetInnerHTML={{
              __html: markdownit({ html: true }).render(content),
            }}></div>
        ) : (
          <textarea
            rows={25}
            onChange={onChangeContent}
            value={content}
            className="form-control h-100"></textarea>
        )}
      </div>
    </div>
  );
}
