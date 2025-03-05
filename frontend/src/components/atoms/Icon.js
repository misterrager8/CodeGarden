export default function Icon({ name, className = "" }) {
  return <span className={className + " bi bi-" + name}></span>;
}
