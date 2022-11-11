import { Link } from "@remix-run/react";
import { type UserData } from "~/models/user.server";
import { Gear, Hashtag, Tweetmix } from "./Icons";
import { UserAvatar } from "./UserAvatar";

export function Layout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: UserData | null;
}) {
  return (
    <div className="flex min-h-screen max-w-7xl px-4 mx-auto">
      <header className="flex-grow pt-1 border-r border-gray-300 dark:border-gray-700">
        <div className="w-[275px]">
          <div className="h-full fixed top-0">
            <Link
              className="p-3 ml-2 rounded-full inline-flex"
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
            {user && <UserNavLink user={user} />}
          </div>
        </div>
      </header>
      <div className="w-full">{children}</div>
      {!user && <LoggedOutBanner />}
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
      className="flex space-x-8 text-xl py-3 px-5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 items-center"
      prefetch="intent"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function LoggedOutBanner() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-blue-500 p-4 text-white">
      <div className="max-w-7xl mx-auto lg:pl-[275px] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Don't miss what's happening</h2>
          <p>People on Tweetmix are the last to know.</p>
        </div>
        <div className="space-x-4">
          <Link
            to="/auth/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full border border-white"
          >
            Log In
          </Link>
          <Link
            to="/auth/signup"
            className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-2 px-4 rounded-full border border-white"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

function UserNavLink({ user }: { user: UserData }) {
  return (
    <Link
      className="bottom-2.5 fixed py-3 px-5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
      to={`/${user.username}`}
      prefetch="intent"
    >
      <UserAvatar user={user}>
        <span className="text-gray-600 dark:text-gray-400">
          @{user.username}
        </span>
      </UserAvatar>
    </Link>
  );
}
