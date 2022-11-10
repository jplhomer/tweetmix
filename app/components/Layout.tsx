import { Gear, Hashtag, Tweetmix } from "./Icons";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <header className="flex-grow">
        <div className="w-[275px]">
          <a
            className="p-3 ml-2 rounded-full inline-flex hover:bg-gray-200"
            href="#"
          >
            <Tweetmix className="w-8 h-8" />
          </a>
          <NavItem href="#" icon={<Hashtag className="w-8 h-8" />}>
            Explore
          </NavItem>
          <NavItem href="#" icon={<Gear className="w-8 h-8" />}>
            Settings
          </NavItem>
        </div>
        <div className="h-full fixed top-0"></div>
      </header>
      <div className="w-full">{children}</div>
    </div>
  );
}

function NavItem({
  icon,
  href,
  children,
}: {
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex space-x-8 text-xl py-3 px-5 rounded-full hover:bg-gray-200"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}
