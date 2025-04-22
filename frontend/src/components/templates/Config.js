import { api } from "../../util";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MultiContext } from "../../MultiContext";

export default function Config({ className = "" }) {
  const [config, setConfig] = useState([]);
  const multiCtx = useContext(MultiContext);

  const getConfig = () => {
    api("git_config", { name: multiCtx.currentRepo?.name }, (data) =>
      setConfig(data.config)
    );
  };

  useEffect(() => {
    getConfig();
  }, []);

  return (
    <div className={className + " p-3"}>
      {config.map((x) => (
        <div key={uuidv4()}>{x}</div>
      ))}
    </div>
  );
}
