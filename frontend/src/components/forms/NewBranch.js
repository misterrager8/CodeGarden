import { useContext, useState } from "react";
import Input from "../atoms/Input";
import { MultiContext } from "../../Context";
// import Button from "../../atoms/Button";
import Dropdown from "../atoms/Dropdown";

export default function NewBranch({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState(null);

  const onChangeName = (e) => setName(e.target.value);

  const prefixes = ["develop"];

  return (
    <form
      className={className + " input-group input-group-sm"}
      onSubmit={(e) => {
        multiCtx.addBranch(e, !prefix ? name : `${prefix}/${name}`);
        setName("");
      }}>
      <Dropdown
        showCaret={!prefix}
        classNameBtn="border-0"
        icon={prefix ? "bezier2" : "tags"}
        text={prefix ? `${prefix}/` : null}>
        <a
          onClick={() => setPrefix(null)}
          className={"dropdown-item muted-label" + (!prefix ? " active" : "")}>
          No Branch Prefix
        </a>
        {prefixes.map((x) => (
          <a
            onClick={() => setPrefix(x)}
            className={"dropdown-item" + (prefix === x ? " active" : "")}>
            {`${x}/`}
          </a>
        ))}
      </Dropdown>
      <Input
        required={true}
        value={name}
        onChange={onChangeName}
        placeholder="New Branch"
      />
    </form>
  );
}
