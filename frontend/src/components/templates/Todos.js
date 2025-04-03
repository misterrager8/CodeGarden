import { useContext } from "react";
import { MultiContext } from "../../MultiContext";
import TodoItem from "../organisms/items/TodoItem";
import NewTodo from "../organisms/forms/NewTodo";
import { SectionContext } from "./Display";
import Kanban from "./Kanban";

export default function Todos({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);
  const label = "todos";

  return (
    <>
      {!sxnCtx.isCurrentSection(label) ? (
        <div
          className={
            className + (sxnCtx.isCurrentSection(label) ? " w-75 mx-auto" : "")
          }>
          <NewTodo className="mb-3" />
          {multiCtx.currentRepo?.todos.length > 0 ? (
            <div style={{ height: "37vh", overflowY: "auto" }}>
              {multiCtx.currentRepo?.todos.map((x) => (
                <TodoItem key={x.id} item={x} />
              ))}
            </div>
          ) : (
            <div style={{ height: "37vh", display: "flex" }}>
              <span className="muted-label-center">No TODOs</span>
            </div>
          )}
        </div>
      ) : (
        <Kanban />
      )}
    </>
  );
}
