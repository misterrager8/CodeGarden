import { Icon } from "@iconify/react";

export default function Dropdown({
  text,
  target,
  icon,
  active = false,
  border = false,
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
          (!border ? " border-0" : "") +
          (active ? " active" : "")
        }
        data-bs-target={"#" + target}
        data-bs-auto-close={autoClose}
        data-bs-toggle="dropdown">
        {icon && <Icon inline icon={icon} />}
        {text && <span className={icon ? "ms-2" : ""}>{text}</span>}
      </a>
      <div id={target} className={"dropdown-menu " + classNameMenu}>
        {children}
      </div>
    </>
  );
}
