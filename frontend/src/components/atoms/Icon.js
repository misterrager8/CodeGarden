export default function Icon({ name, onClick, className = "" }) {
  return (
    <span onClick={onClick} className={className + " bi bi-" + name}></span>
  );
}
