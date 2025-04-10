import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import { MultiContext } from "../../../MultiContext";
import { api } from "../../../util";

export default function NewStash({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  const stash = (e) => {
    e.preventDefault();
    multiCtx.setLoading(true);
    api(
      "push_stash",
      {
        repository: multiCtx.currentRepo.name,
        name: name,
      },
      function (data) {
        multiCtx.setCurrentRepo(data.repo);
        multiCtx.setRepos(data.repos);
        multiCtx.setLoading(false);
      }
    );
  };

  return (
    <form
      className={className + " input-group"}
      onSubmit={(e) => {
        stash(e, name);
        setName("");
      }}>
      <Input onChange={onChangeName} value={name} placeholder="New Stash" />
    </form>
  );
}
