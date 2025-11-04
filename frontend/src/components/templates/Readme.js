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

  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
    selected: "",
  });

  const sxnCtx = useContext(SectionContext);
  const label = "readme";

  const formats = [
    {
      icon: "type-bold",
      label: "bold",
      format: `**${selection.selected}**`,
    },
    {
      icon: "type-italic",
      label: "italic",
      format: `*${selection.selected}*`,
    },
    {
      icon: "type-h1",
      label: "heading",
      format: `### ${selection.selected}`,
    },
    {
      icon: "hr",
      label: "hrule",
      format: "\n---\n",
    },
    {
      icon: "list-ul",
      label: "bullet-list",
      format: `- ${selection.selected.split("\n").join("\n- ")}`,
    },
    {
      icon: "code-slash",
      label: "code",
      format: `\`\`\`${selection.selected}\`\`\``,
    },
    {
      icon: "code",
      label: "code-inline",
      format: `\`${selection.selected}\``,
    },
    {
      icon: "image",
      label: "image",
      format: `![${selection.selected}]()`,
    },
    {
      icon: "link",
      label: "link",
      format: `[](${selection.selected})`,
    },
    {
      icon: "type",
      label: "capitalize",
      format: `${
        selection.selected.charAt(0).toUpperCase() + selection.selected.slice(1)
      }`,
    },
    {
      icon: "alphabet-uppercase",
      label: "allcaps",
      format: `${selection.selected.toUpperCase()}`,
    },
    {
      icon: "alphabet",
      label: "alllower",
      format: `${selection.selected.toLowerCase()}`,
    },
    {
      icon: "indent",
      label: "indent",
      format: `  ${selection.selected}`,
    },
    {
      text: "( )",
      label: "parentheses",
      format: `(${selection.selected})`,
    },
    {
      text: "{ }",
      label: "curly-braces",
      format: `{${selection.selected}}`,
    },
    {
      text: "[ ]",
      label: "square-brackets",
      format: `[${selection.selected}]`,
    },
    {
      text: "' '",
      label: "single-quotes",
      format: `'${selection.selected}'`,
    },
    {
      text: '" "',
      label: "double-quotes",
      format: `"${selection.selected}"`,
    },
  ];

  const getSelection = () => {
    let elem = document.getElementById("editor");

    let start = elem.selectionStart;
    let end = elem.selectionEnd;
    let selected = content.substring(start, end);

    setSelection({ start: start, end: end, selected: selected });
  };

  const copyFormat = (format) => {
    let format_ = formats.filter((x) => x.label === format)[0];
    let new_ =
      content.substring(0, selection.start) +
      format_.format +
      content.substring(selection.end, content.length);
    setContent(new_);
  };

  const onChangeContent = (e) => setContent(e.target.value);

  useEffect(() => {
    setContent(multiCtx.currentRepo.readme);
  }, [multiCtx.currentRepo]);

  return (
    <div
      className={className + (sxnCtx.isCurrentSection(label) ? " w-100" : "")}>
      <div className={"mb-3" + (sxnCtx.isCurrentSection(label) ? " mt-3" : "")}>
        {!sxnCtx.isCurrentSection(label) && (
          <Button
            className="me-1"
            icon={mode === "write" ? "eye" : "pencil"}
            text={mode === "write" ? "View" : "Edit"}
            onClick={() => setMode(mode === "read" ? "write" : "read")}
          />
        )}
        {(mode === "write" || sxnCtx.isCurrentSection(label)) && (
          <ButtonGroup>
            <Button
              onClick={() => {
                multiCtx.editReadme(content);
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
              }}
              className="green"
              icon={saved ? "check-lg" : "floppy2"}
            />
            {formats.map((x) => (
              <Button
                icon={x.icon}
                text={x.text}
                onClick={() => copyFormat(x.label)}
              />
            ))}
          </ButtonGroup>
        )}
      </div>
      {!sxnCtx.isCurrentSection(label) ? (
        <div style={{ height: "79vh", overflowY: "auto" }}>
          {mode === "read" ? (
            <div
              id="readme"
              dangerouslySetInnerHTML={{
                __html: markdownit({ html: true }).render(content),
              }}></div>
          ) : (
            <textarea
              id="editor"
              onMouseUp={() => getSelection()}
              rows={25}
              onChange={onChangeContent}
              value={content}
              className="form-control h-100"></textarea>
          )}
        </div>
      ) : (
        <div style={{ height: "75vh", display: "flex" }}>
          <textarea
            id="editor"
            rows={25}
            onMouseUp={() => getSelection()}
            onChange={onChangeContent}
            value={content}
            className="form-control h-100 w-50 me-4"></textarea>
          <div className="w-50 h-100 overflow-auto px-4">
            <div
              id="readme"
              dangerouslySetInnerHTML={{
                __html: markdownit({ html: true }).render(content),
              }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
