import { useContext } from "react";
import { MultiContext } from "../../Context";
import Icon from "../atoms/Icon";

export default function RepoItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);

  return (
    <a
      onClick={() => multiCtx.getRepo(item.name)}
      className={
        className +
        " dropdown-item between" +
        (multiCtx.currentRepo?.name === item.name ? " active" : "")
      }>
      <div>{item.name}</div>
      <div>
        {item.diffs.length > 0 && (
          <span className="ps-2 orange">
            <Icon
              name="material-symbols-light:change-history-rounded"
              className="me-1"
            />
            {item.diffs.length}
          </span>
        )}
        {item.todos.filter((todo) => todo.status !== "completed").length >
          0 && (
          <span className="ps-2 orange">
            <Icon name="mdi:check-bold" className="me-1" />
            {item.todos.filter((todo) => todo.status !== "completed").length}
          </span>
        )}
      </div>
    </a>
  );
}
