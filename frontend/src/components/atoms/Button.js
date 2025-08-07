export default function Button({
  text,
  type_ = "button",
  icon,
  size = "sm",
  border = true,
  onClick,
  className = "",
  active = false,
}) {
  return (
    <button
      type={type_}
      className={
        className +
        " btn" +
        (size ? ` btn-${size}` : "") +
        (border ? "" : " border-0") +
        (active ? " active" : "")
      }
      onClick={onClick}>
      {icon && (
        <i
          className={
            className + (" bi bi-" + icon) + (text ? " me-2" : "")
          }></i>
      )}
      {text}
    </button>
  );
}
