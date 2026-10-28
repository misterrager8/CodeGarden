import { Icon } from "@iconify/react";

export default function Button({
  text,
  onClick,
  icon,
  type_ = "button",
  border = false,
  active,
  className = "",
  children,
  tooltip,
}) {
  return (
    <button
      title={tooltip}
      type={type_}
      onClick={onClick}
      className={
        className +
        " btn" +
        (active ? " active" : "") +
        (border ? "" : " border-0")
      }>
      {icon && <Icon inline icon={icon} />}
      {text && <span className={icon ? "ms-2" : ""}>{text}</span>}
      {children}
    </button>
  );
}
