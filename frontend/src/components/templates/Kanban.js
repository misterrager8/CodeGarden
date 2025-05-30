import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../MultiContext";
import NewTodo from "../organisms/forms/NewTodo";
import Button from "../atoms/Button";
import NewTag from "../organisms/forms/NewTag";
import TagItem from "../organisms/items/TagItem";
import TodoItem from "../organisms/items/TodoItem";

export const SortContext = createContext();

export default function Kanban({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    if (multiCtx.currentRepo) {
      let todos_ = multiCtx.currentRepo.todos;
      setTodos(filter ? todos_.filter((x) => x.tag === filter) : todos_);
    }
  }, [multiCtx.currentRepo, filter]);

  const contextValue = {
    filter: filter,
    setFilter: setFilter,
  };

  return (
    <SortContext.Provider value={contextValue}>
      <div>
        <NewTodo className="" />
        <hr />
        <div className="row">
          <div className="row col-10 border-end me-2">
            <div className="col-4">
              <div className="kanban-heading mb-3">To Do</div>
              <div style={{ height: "67vh", overflowY: "auto" }}>
                {todos
                  .filter((x) => x.status === "open")
                  .map((x) => (
                    <TodoItem item={x} key={x.id} />
                  ))}
              </div>
            </div>
            <div className="col-4">
              <div className="kanban-heading mb-3">Doing</div>
              <div style={{ height: "67vh", overflowY: "auto" }}>
                {todos
                  .filter((x) => x.status === "active")
                  .map((x) => (
                    <TodoItem item={x} key={x.id} />
                  ))}
              </div>
            </div>
            <div className="col-4">
              <div className="text-center mb-3">
                <div className="kanban-heading">Done</div>
                {todos.filter((x) => x.done).length !== 0 && (
                  <Button
                    border={false}
                    size="sm"
                    icon="eraser-fill"
                    text={`Clear Completed (${
                      todos.filter((x) => x.done).length
                    })`}
                    onClick={() => multiCtx.clearCompleted()}
                    className="red"
                  />
                )}
              </div>
              <div style={{ height: "62vh", overflowY: "auto" }}>
                {todos
                  .filter((x) => x.status === "completed")
                  .map((x) => (
                    <TodoItem item={x} key={x.id} />
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
    </SortContext.Provider>
  );
}
