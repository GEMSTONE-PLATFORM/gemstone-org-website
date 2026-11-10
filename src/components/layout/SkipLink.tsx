interface SkipLinkProps {
  readonly targetId?: string;
}

/** Provides a server-rendered keyboard path to the page's primary landmark. */
export function SkipLink({ targetId = "main-content" }: SkipLinkProps) {
  return (
    <a className="gemstone-skip-link" href={`#${targetId}`}>
      Skip to main content
    </a>
  );
}
