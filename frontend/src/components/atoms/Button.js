export default function Button({
  text,
  onClick,
  size = "sm",
  icon,
  type_ = "button",
  border = true,
  active,
  className = "",
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
      {icon && <i className={(text ? "me-2" : "") + " bi bi-" + icon}></i>}
      {text}
    </button>
  );
}
