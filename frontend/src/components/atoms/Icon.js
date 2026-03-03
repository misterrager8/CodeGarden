import { Icon as Icon_ } from "@iconify/react";

export default function Icon({ name, onClick, className = "" }) {
  return <Icon_ onClick={onClick} inline className={className} icon={name} />;
}
