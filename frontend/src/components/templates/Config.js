import { api } from "../../util";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Config({ className = "" }) {
  const [config, setConfig] = useState([]);

  const getConfig = () => {
    api("git_config", {}, (data) => setConfig(data.config));
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
