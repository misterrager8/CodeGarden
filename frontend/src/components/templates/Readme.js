import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../MultiContext";
import Button from "../atoms/Button";
import { SectionContext } from "./Display";

export default function Readme({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [mode, setMode] = useState("read");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);

  const sxnCtx = useContext(SectionContext);
  const label = "readme";

  const onChangeContent = (e) => setContent(e.target.value);

  useEffect(() => {
    setContent(multiCtx.currentRepo.readme.txt);
  }, [multiCtx.currentRepo]);

  return (
    <div
      className={
        className + (sxnCtx.isCurrentSection(label) ? " w-75 mx-auto" : "")
      }>
      <Button
        text={sxnCtx.isCurrentSection(label) ? "Minimize" : "Maximize"}
        border={false}
        className="flex-grow-0 mb-1"
        icon={sxnCtx.isCurrentSection(label) ? "fullscreen-exit" : "fullscreen"}
        onClick={() =>
          sxnCtx.setCurrentSection(
            sxnCtx.isCurrentSection(label) ? null : label
          )
        }
      />
      <div className="between mb-3">
        <Button
          icon={mode === "write" ? "eye" : "pencil"}
          text={mode === "write" ? "View" : "Edit"}
          onClick={() => setMode(mode === "read" ? "write" : "read")}
        />
        {mode === "write" && (
          <Button
            onClick={() => {
              multiCtx.editReadme(content);
              setSaved(true);
              setTimeout(() => setSaved(false), 1500);
            }}
            className="green ms-3"
            icon={saved ? "check-lg" : "floppy2"}
            // text={mode === "write" ? "View" : "Edit"}
            // onClick={() => setMode(mode === "read" ? "write" : "read")}
          />
        )}
      </div>
      <div style={{ height: "75vh", overflowY: "auto" }}>
        {mode === "read" ? (
          <div
            id="readme"
            dangerouslySetInnerHTML={{
              __html: multiCtx.currentRepo?.readme?.md,
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
