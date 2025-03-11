import { useContext } from "react";
import { MultiContext } from "../../MultiContext";
import NewTodo from "../organisms/forms/NewTodo";
import Button from "../atoms/Button";
import KanbanItem from "../organisms/KanbanItem";

export default function Kanban({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div>
      <NewTodo className="" />
      <hr />
      <div className="row">
        <div className="col-4">
          <div className="text-center h5 mb-3">To Do</div>
          <div style={{ height: "70vh", overflowY: "auto" }}>
            {multiCtx.currentRepo.todos
              .filter((x) => x.status === "open")
              .map((x) => (
                <KanbanItem item={x} key={x.id} />
              ))}
          </div>
        </div>
        <div className="col-4">
          <div className="text-center h5 mb-3">Doing</div>
          <div style={{ height: "70vh", overflowY: "auto" }}>
            {multiCtx.currentRepo.todos
              .filter((x) => x.status === "active")
              .map((x) => (
                <KanbanItem item={x} key={x.id} />
              ))}
          </div>
        </div>
        <div className="col-4">
          <div className="text-center mb-3">
            <div className="h5">Done</div>
            {multiCtx.currentRepo.todos.filter((x) => x.done).length !== 0 && (
              <Button
                border={false}
                size="sm"
                icon="x-lg"
                text={`Clear Completed (${
                  multiCtx.currentRepo.todos.filter((x) => x.done).length
                })`}
                onClick={() => multiCtx.clearCompleted()}
                className="orange"
              />
            )}
          </div>
          <div style={{ height: "65vh", overflowY: "auto" }}>
            {multiCtx.currentRepo.todos
              .filter((x) => x.status === "completed")
              .map((x) => (
                <KanbanItem item={x} key={x.id} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
