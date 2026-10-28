import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import Button from "../atoms/Button";
import markdownit from "markdown-it";

export default function Readme({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [content, setContent] = useState("");

  const onChangeContent = (e) => setContent(e.target.value);

  useEffect(() => {
    setContent(multiCtx.currentRepo?.readme || "");
  }, [multiCtx.currentRepo]);

  return (
    <div className={className}>
      <div className="flex" style={{ fontSize: "2rem" }}>
        <div className="col-50">
          <div
            className={
              multiCtx.currentRepo?.readme !== content ? "" : "invisible"
            }>
            <Button
              text="Save Changes"
              onClick={() => multiCtx.editReadme(content)}
              className="orange mb-1"
              icon="bxs:save"
            />
          </div>
          <textarea
            style={{
              fontSize: "1.5rem",
              fontFamily: "monospace",
            }}
            id="editor"
            onMouseUp={() => getSelection()}
            rows={17}
            onChange={onChangeContent}
            value={content}
            className="form-control "></textarea>
        </div>
        <div className="divider"></div>
        <div
          className="col-50"
          id="readme"
          dangerouslySetInnerHTML={{
            __html: markdownit({ html: true }).render(content),
          }}></div>
      </div>
    </div>
  );
}
