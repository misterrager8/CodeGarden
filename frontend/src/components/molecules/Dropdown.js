export default function Dropdown({
  text,
  target,
  icon,
  size = "sm",
  children,
  classNameBtn = "",
  classNameMenu = "",
}) {
  return (
    <>
      <a
        data-bs-target={"#" + target}
        data-bs-toggle="dropdown"
        className={
          classNameBtn + " btn dropdown-toggle" + (size ? ` btn-${size}` : "")
        }>
        {icon && <i className={"me-2 bi bi-" + icon}></i>}
        {text}
      </a>
      <div id={target} className={classNameMenu + " dropdown-menu"}>
        {children}
      </div>
    </>
  );
}
