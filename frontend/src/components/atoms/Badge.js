export default function Badge({ text, className = "" }) {
  return <span className={className + " badge"}>{text}</span>;
}
