export default function Input({
  value,
  title,
  onChange,
  required = false,
  disabled = false,
  placeholder,
  type_ = "text",
  className = "",
}) {
  return (
    <input
      disabled={disabled}
      title={title}
      required={required}
      type={type_}
      autoComplete="off"
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className={className + " input"}
    />
  );
}
