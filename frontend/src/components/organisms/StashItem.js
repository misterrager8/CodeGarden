import { useContext } from "react";
import { MultiContext } from "../../MultiContext";

export default function StashItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);

  return <div className={className + " text-truncate"}>{item}</div>;
}
