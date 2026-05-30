import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router";
import {
  Link as StyledLink,
  type LinkProps as StyledLinkProps,
} from "@otbt/ui";

type LinkProps = RouterLinkProps & {
  variant?: StyledLinkProps["variant"];
  unstyled?: boolean;
};

export function Link({
  className,
  variant,
  unstyled = false,
  ...props
}: LinkProps) {
  const linkElement = (
    <RouterLink
      className={unstyled ? className : undefined}
      {...props}
    />
  );

  if (unstyled) {
    return linkElement;
  }

  return (
    <StyledLink asChild className={className} variant={variant}>
      {linkElement}
    </StyledLink>
  );
}
