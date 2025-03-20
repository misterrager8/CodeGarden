import { useContext } from "react";
import { MultiContext } from "../../MultiContext";
import TodoItem from "../organisms/TodoItem";
import NewTodo from "../organisms/forms/NewTodo";
import { SectionContext } from "./Display";
import Button from "../atoms/Button";
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
          <Button
            text={sxnCtx.isCurrentSection(label) ? "Minimize" : "Maximize"}
            border={false}
            className="flex-grow-0 mb-1"
            icon={
              sxnCtx.isCurrentSection(label) ? "fullscreen-exit" : "fullscreen"
            }
            onClick={() =>
              sxnCtx.setCurrentSection(
                sxnCtx.isCurrentSection(label) ? null : label
              )
            }
          />
          <NewTodo className="mb-3" />
          {multiCtx.currentRepo?.todos.length > 0 ? (
            <div style={{ height: "28vh", overflowY: "auto" }}>
              {multiCtx.currentRepo?.todos.map((x) => (
                <TodoItem key={x.id} item={x} />
              ))}
            </div>
          ) : (
            <div className="d-flex h-100">
              <span className="m-auto small opacity-50">No Todos</span>
            </div>
          )}
        </div>
      ) : (
        <>
          <Button
            text={sxnCtx.isCurrentSection(label) ? "Minimize" : "Maximize"}
            border={false}
            className="flex-grow-0 mb-1"
            icon={
              sxnCtx.isCurrentSection(label) ? "fullscreen-exit" : "fullscreen"
            }
            onClick={() =>
              sxnCtx.setCurrentSection(
                sxnCtx.isCurrentSection(label) ? null : label
              )
            }
          />
          <Kanban />
        </>
      )}
    </>
  );
}
