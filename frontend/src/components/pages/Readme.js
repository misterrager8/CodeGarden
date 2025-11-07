import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import ButtonGroup from "../atoms/ButtonGroup";
import Button from "../atoms/Button";
import markdownit from "markdown-it";

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
    setContent(multiCtx.currentRepo?.readme || "");
  }, [multiCtx.currentRepo]);

  return (
    <div className={className}>
      <div className="flex">
        <div className="col-50">
          <div
            className={
              multiCtx.currentRepo?.readme !== content ? "" : "invisible"
            }>
            <Button
              text="Save Changes"
              onClick={() => {
                multiCtx.editReadme(content);
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
              }}
              className="orange mb-1"
              icon="record2-fill"
            />
          </div>
          <textarea
            id="editor"
            onMouseUp={() => getSelection()}
            rows={25}
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
