import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import TodoItem from "../items/TodoItem";
import Input from "../atoms/Input";
import TagItem from "../items/TagItem";
import NewTodo from "../forms/NewTodo";
import NewTag from "../forms/NewTag";

export const FilterContext = createContext();

export default function Kanban({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [filter, setFilter] = useState(null);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (multiCtx.currentRepo) {
      let todos_ = multiCtx.currentRepo?.todos;
      setTodos(filter ? todos_.filter((x) => x.tag === filter) : todos_);
    }
  }, [multiCtx.currentRepo, filter]);

  const [undone, setUndone] = useState([]);
  const [doing, setDoing] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(() => {
    setUndone(todos.filter((todo) => todo.status === "open"));
    setDoing(todos.filter((todo) => todo.status === "active"));
    setDone(todos.filter((todo) => todo.status === "completed"));
  }, [todos]);

  const contextValue = {
    filter: filter,
    setFilter: setFilter,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      <div className={className + " flex h-100"}>
        <div className="col-75 flex">
          <div className="col-33 show-on-mini">
            <div className="heading">ACTIVE</div>
            {doing.map((todo) => (
              <TodoItem key={todo.id} item={todo} />
            ))}
          </div>

          <div className="col-33">
            <div className="heading">TODO</div>
            <NewTodo />
            <div className="mt-3" style={{ height: "69vh", overflowY: "auto" }}>
              {undone.map((todo) => (
                <TodoItem key={todo.id} item={todo} />
              ))}
            </div>
          </div>

          <div className="col-33 hide-on-mini">
            <div className="heading">ACTIVE</div>
            {doing.map((todo) => (
              <TodoItem key={todo.id} item={todo} />
            ))}
          </div>

          <div className="col-33">
            <div className="heading">DONE</div>
            <div style={{ height: "76vh", overflowY: "auto" }}>
              {done.map((todo) => (
                <TodoItem key={todo.id} item={todo} />
              ))}
            </div>
          </div>
        </div>

        <div className="divider"></div>
        <div className="col-25">
          <div className="heading">TAGS</div>
          <NewTag className="mb-2" />
          {multiCtx.tags.map((tag) => (
            <TagItem item={tag} />
          ))}
        </div>
      </div>
    </FilterContext.Provider>
  );
}
