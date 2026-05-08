import type { ReactNode } from "react";

export function Panel({
  id,
  title,
  subtitle,
  tags,
  children,
  footer,
  className = "",
}: {
  id?: string;
  title?: string;
  subtitle?: string;
  tags?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`panel ${className}`}>
      <span className="br tl" />
      <span className="br tr" />
      <span className="br bl" />
      <span className="br br2" />
      {(id || title || subtitle || tags) && (
        <div className="p-head">
          <div className="flex items-center gap-3 min-w-0">
            {id && <span className="p-id">{id}</span>}
            <div className="flex flex-col min-w-0">
              {title && <span className="p-title truncate">{title}</span>}
              {subtitle && <span className="p-sub truncate">{subtitle}</span>}
            </div>
          </div>
          {tags && <div className="flex items-center gap-2 shrink-0">{tags}</div>}
        </div>
      )}
      <div className="p-body">{children}</div>
      {footer && <div className="p-foot">{footer}</div>}
    </div>
  );
}

export function CornerBrackets() {
  return (
    <>
      <span className="br tl" />
      <span className="br tr" />
      <span className="br bl" />
      <span className="br br2" />
    </>
  );
}
