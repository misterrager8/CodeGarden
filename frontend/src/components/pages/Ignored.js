import { useContext } from "react";
import { MultiContext } from "../../Context";
import IgnoreItem from "../items/IgnoreItem";
// import NewIgnored from "../organisms/forms/NewIgnored";
import { v4 as uuidv4 } from "uuid";
import NewIgnored from "../forms/NewIgnore";

export default function Ignored({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const label = "ignred";

  return (
    <div className={className + ""}>
      <NewIgnored />
      {multiCtx.currentRepo?.ignored.length > 0 ? (
        <div style={{ height: "78vh", overflowY: "auto" }}>
          {multiCtx.currentRepo?.ignored.map((x, idx) => (
            <IgnoreItem id={idx} key={uuidv4()} item={x} />
          ))}
        </div>
      ) : (
        <div>
          <span className="muted-text">No Ignored</span>
        </div>
      )}
    </div>
  );
}
