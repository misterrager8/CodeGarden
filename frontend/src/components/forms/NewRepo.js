import { useContext, useState } from "react";
import Input from "../atoms/Input";
import { MultiContext } from "../../Context";
import Button from "../atoms/Button";
import { api } from "../../util";

export default function NewRepo({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onChangeName = (e) => setName(e.target.value);
  const onChangeDescription = (e) => setDescription(e.target.value);

  const generateName = () => {
    multiCtx.setLoading(true);
    api("generate_name", {}, (data) => {
      setName(data.name);
      multiCtx.setLoading(false);
    });
  };

  return (
    <form
      className={className}
      onSubmit={(e) => {
        multiCtx.addRepo(e, name);
        setName("");
      }}>
      <div className="input-group input-group-sm">
        <Input
          required={true}
          value={name}
          onChange={onChangeName}
          placeholder="New Repo"
        />
        <Button
          onClick={() => generateName()}
          text="Generate Name"
          icon="shuffle"
        />
      </div>
      <textarea
        rows={10}
        placeholder="Description"
        value={description}
        onChange={onChangeDescription}
        className="form-control form-control-sm mt-3"
        autoComplete="off"></textarea>
      <Button
        type_="submit"
        className="mt-3 w-100"
        text="Create New Repo"
        icon="plus-lg"
      />
    </form>
  );
}
