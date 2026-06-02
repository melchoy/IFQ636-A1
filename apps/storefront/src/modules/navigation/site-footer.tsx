import { Link } from "@otbt/web";

type FooterLink = {
  label: string;
  to?: string;
};

type FooterLinkGroup = {
  title: string;
  links: FooterLink[];
};

const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "Collection", to: "/" },
      { label: "Occasions", to: "/occasions" },
      { label: "Objects" },
    ],
  },
  {
    title: "Customer account",
    links: [
      { label: "Sign in", to: "/login" },
      { label: "Register", to: "/register" },
      { label: "Support" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Delivery" },
      { label: "Notes" },
      { label: "Contact" },
    ],
  },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (!link.to) {
    return (
      <span className="text-sm leading-5 text-muted-foreground">{link.label}</span>
    );
  }

  return (
    <Link
      className="text-sm leading-5 text-muted-foreground transition-colors hover:text-foreground"
      to={link.to}
      unstyled
    >
      {link.label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto px-4 pt-10 md:px-6">
      <div className="storefront-container">
        <div className="flex flex-col gap-8 rounded-2xl border border-border/80 bg-[color-mix(in_oklab,var(--bt-obsidian)_72%,transparent)] p-6 lg:flex-row lg:gap-6">
          <div className="min-w-0 flex-1 lg:max-w-[52%]">
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Order of the Black Thorn
            </p>
            <p className="mt-2 max-w-sm text-sm leading-[22px] text-muted-foreground">
              Order arrangements, candles, vessels, and keepsakes for delivery,
              memorials, and evening occasions.
            </p>
          </div>

          <div className="grid flex-1 gap-6 sm:grid-cols-3">
            {footerLinkGroups.map((group) => (
              <div className="flex flex-col gap-2.5" key={group.title}>
                <p className="text-sm font-semibold text-foreground">
                  {group.title}
                </p>
                <div className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <FooterLinkItem key={link.label} link={link} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
