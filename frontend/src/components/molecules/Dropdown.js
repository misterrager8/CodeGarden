export default function Dropdown({
  text,
  target,
  icon,
  size = "sm",
  children,
  autoClose = true,
  classNameBtn = "",
  classNameMenu = "",
  showCaret = true,
}) {
  return (
    <>
      <a
        className={
          classNameBtn +
          " btn" +
          (showCaret ? " dropdown-toggle" : "") +
          (size ? ` btn-${size}` : "")
        }
        data-bs-target={"#" + target}
        data-bs-auto-close={autoClose}
        data-bs-toggle="dropdown">
        {icon && <i className={"bi bi-" + icon + (text ? " me-2" : "")}></i>}
        {text}
      </a>
      <div id={target} className={"dropdown-menu " + classNameMenu}>
        {children}
      </div>
    </>
  );
}
