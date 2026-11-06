import { useContext, useState } from "react";
import Input from "../atoms/Input";
import { MultiContext } from "../../Context";
import Button from "../atoms/Button";
import { api } from "../../util";

export default function Clone({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const onChangeName = (e) => setName(e.target.value);
  const onChangeUrl = (e) => setUrl(e.target.value);

  const clone = (e) => {
    e.preventDefault();
    multiCtx.setLoading(true);
    api("clone_repository", { url: url, name: name }, (data) => {
      multiCtx.setCurrentRepo(data.repo);
      multiCtx.setLoading(false);
    });
  };

  return (
    <form
      className={className + " d-flex flex-column gap-2"}
      onSubmit={(e) => clone(e)}>
      <Input required value={url} onChange={onChangeUrl} placeholder="URL" />
      <Input required value={name} onChange={onChangeName} placeholder="Name" />
      <Button type_="submit" text="Clone Repo" icon="mynaui:plus-solid" />
    </form>
  );
}
