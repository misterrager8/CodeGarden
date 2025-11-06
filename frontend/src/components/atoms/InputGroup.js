export default function InputGroup({ size = "sm", children, className = "" }) {
  return (
    <div
      className={
        className + " input-group" + (size ? ` input-group-${size}` : "")
      }>
      {children}
    </div>
  );
}
