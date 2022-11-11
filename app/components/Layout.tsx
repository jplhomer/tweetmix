import { Link } from "@remix-run/react";
import { Gear, Hashtag, Tweetmix } from "./Icons";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex dark:text-gray-100 dark:bg-gray-800 min-h-screen">
      <header className="flex-grow">
        <div className="w-[275px]">
          <Link
            className="p-3 ml-2 rounded-full inline-flex hover:bg-blue-50 dark:hover:bg-blue-900"
            to="/"
            prefetch="intent"
          >
            <Tweetmix className="w-8 h-8 fill-current" />
          </Link>
          <NavItem
            to="/explore"
            icon={<Hashtag className="w-8 h-8 fill-current" />}
          >
            Explore
          </NavItem>
          <NavItem
            to="/settings"
            icon={<Gear className="w-8 h-8 fill-current" />}
          >
            Settings
          </NavItem>
        </div>
        <div className="h-full fixed top-0"></div>
      </header>
      <div className="w-full p-4">{children}</div>
    </div>
  );
}

function NavItem({
  icon,
  to,
  children,
}: {
  icon: React.ReactNode;
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex space-x-8 text-xl py-3 px-5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 items-center"
      prefetch="intent"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
