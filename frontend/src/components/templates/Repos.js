import { useContext, useEffect } from "react";
import { MultiContext } from "../../MultiContext";

export default function Repos({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  // useEffect(() => {
  //   multiCtx.getRepos();
  // }, []);

  return (
    <div className={className}>
      <div className="h1 text-center">Repos</div>
      <div className="mt-3">
        {multiCtx.repos.map((x) => (
          <div
            onClick={() => {
              multiCtx.setCurrentRepo(x);
              multiCtx.setCurrentPage("todos");
            }}>
            {x.name}
          </div>
        ))}
      </div>
    </div>
  );
}
