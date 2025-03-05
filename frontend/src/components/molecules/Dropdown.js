export default function Dropdown({
  text,
  target,
  icon,
  size = "sm",
  children,
  autoClose = true,
  classNameBtn = "",
  classNameMenu = "",
}) {
  return (
    <>
      <a
        className={
          (size ? `btn-${size}` : "") + " btn dropdown-toggle " + classNameBtn
        }
        data-bs-target={"#" + target}
        data-bs-auto-close={autoClose}
        data-bs-toggle="dropdown">
        {icon && <i className={"me-2 bi bi-" + icon}></i>}
        {text}
      </a>
      <div id={target} className={"dropdown-menu " + classNameMenu}>
        {children}
      </div>
    </>
  );
}
