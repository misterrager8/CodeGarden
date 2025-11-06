export default function ButtonGroup({ children, size = "sm", className = "" }) {
  return (
    <div
      className={className + " btn-group" + (size ? ` btn-group-${size}` : "")}>
      {children}
    </div>
  );
}
