import { useContext } from "react";
import { MultiContext } from "../../Context";

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
            <i className="me-1 bi bi-record-fill"></i>
            {item.diffs.length}
          </span>
        )}
        {item.todos.filter((todo) => todo.status !== "completed").length >
          0 && (
          <span className="ps-2 orange">
            <i className="me-1 bi bi-check-all"></i>
            {item.todos.filter((todo) => todo.status !== "completed").length}
          </span>
        )}
      </div>
    </a>
  );
}
