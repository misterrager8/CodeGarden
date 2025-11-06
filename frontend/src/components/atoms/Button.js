export default function Button({
  text,
  onClick,
  size = "sm",
  icon,
  type_ = "button",
  border = false,
  active,
  className = "",
  children,
}) {
  return (
    <button
      type={type_}
      onClick={onClick}
      className={
        className +
        " btn" +
        (active ? " active" : "") +
        (border ? "" : " border-0") +
        (size ? ` btn-${size}` : "")
      }>
      {icon && <i className={" bi bi-" + icon}></i>}
      {text && <span className={icon ? "ms-2" : ""}>{text}</span>}
      {children}
    </button>
  );
}
