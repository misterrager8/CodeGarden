export default function Button({
  value,
  onChange,
  placeholder,
  type_ = "text",
  className = "",
  size = "sm",
}) {
  return (
    <input
      autoComplete="off"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type_}
      className={
        className + " form-control" + (size ? ` form-control-${size}` : "")
      }
    />
  );
}
