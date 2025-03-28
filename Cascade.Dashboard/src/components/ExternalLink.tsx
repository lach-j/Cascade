import React from "react";
import { LuExternalLink } from "react-icons/lu";

type ExternalLinkProps = {
  href: string;
  className?: string;
};

const ExternalLink = ({
  href,
  children,
  className,
}: React.PropsWithChildren<ExternalLinkProps>) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors ${className}`}
    >
      {children}
      <LuExternalLink className="h-4 w-4" />
    </a>
  );
};

export default ExternalLink;
