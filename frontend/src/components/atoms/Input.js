export default function Input({
  value,
  onChange,
  required = false,
  size = "sm",
  placeholder,
  type_ = "text",
  className = "",
}) {
  return (
    <input
      required={required}
      type={type_}
      autoComplete="off"
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className={
        className + " form-control" + (size ? ` form-control-${size}` : "")
      }
    />
  );
}
