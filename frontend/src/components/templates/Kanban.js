import { useContext } from "react";
import { MultiContext } from "../../MultiContext";
import NewTodo from "../organisms/forms/NewTodo";
import Button from "../atoms/Button";
import KanbanItem from "../organisms/KanbanItem";
import NewTag from "../organisms/forms/NewTag";
import Icon from "../atoms/Icon";
import TagItem from "../organisms/TagItem";
import { v4 as uuidv4 } from "uuid";

export default function Kanban({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div>
      <NewTodo className="" />
      <hr />
      <div className="row">
        <div className="row col-10 border-end me-2">
          <div className="col-4">
            <div className="text-center h5 mb-3">To Do</div>
            <div style={{ height: "67vh", overflowY: "auto" }}>
              {multiCtx.currentRepo.todos
                .filter((x) => x.status === "open")
                .map((x) => (
                  <KanbanItem item={x} key={x.id} />
                ))}
            </div>
          </div>
          <div className="col-4">
            <div className="text-center h5 mb-3">Doing</div>
            <div style={{ height: "67vh", overflowY: "auto" }}>
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
              {multiCtx.currentRepo.todos.filter((x) => x.done).length !==
                0 && (
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
            <div style={{ height: "62vh", overflowY: "auto" }}>
              {multiCtx.currentRepo.todos
                .filter((x) => x.status === "completed")
                .map((x) => (
                  <KanbanItem item={x} key={x.id} />
                ))}
            </div>
          </div>
        </div>
        <div className="col-2">
          <NewTag className="mb-3" />
          <div>
            {multiCtx.tags.map((x) => (
              <TagItem key={x.id} item={x} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
