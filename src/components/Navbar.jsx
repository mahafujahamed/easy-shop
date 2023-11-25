"use client";

import { afterLoginNavData, beforeLoginNavData } from "@/data/navData";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import useTheme from "@/hooks/useTheme";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import NavLink from "./NavLink";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { uid, displayName, photoURL } = user || {};

    const navData = uid ? afterLoginNavData : beforeLoginNavData;
    const { theme, toggleTheme } = useTheme();
    const { replace, refresh } = useRouter();
    const path = usePathname();

    const [navToggle, setNavToggle] = useState(false);
    const { cart } = useCart();
    const total = useMemo(
        () => cart.reduce((pre, cur) => cur.price * cur.quantity + pre, 0),
        [cart]
    );

    const handleLogout = async () => {
        const toastId = toast.loading("Loading...");
        try {
            await logout();
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });
            await res.json();
            if (path.includes("/dashboard") || path.includes("/profile")) {
                replace(`/login?redirectUrl=${path}`);
            }
            toast.dismiss(toastId);
            toast.success("Successfully logout!");
            startTransition(() => {
                refresh();
            });
        } catch (error) {
            toast.error("Successfully not logout!");
            toast.dismiss(toastId);
        }
    };

    return (
        <nav className="navbar sticky top-0 z-10 bg-slate-200 shadow-lg dark:bg-slate-900 lg:pr-3">
            <div className="flex-1">
                <Link href="/" className="btn-ghost btn text-2xl normal-case">
                    Easy Shop
                </Link>
            </div>
            <div
                className={`absolute ${navToggle ? "left-0" : "left-[-120%]"
                    } top-[4.5rem] flex w-full flex-col bg-slate-200 pb-3 pt-2 transition-all duration-300 dark:bg-slate-900 lg:static lg:w-[unset] lg:flex-row lg:bg-transparent lg:pb-0 lg:pt-0 dark:lg:bg-transparent`}
            >
                <ul className="menu menu-horizontal flex-col px-1 lg:flex-row">
                    {navData.map(({ path, title }) => (
                        <li key={path} className="mx-auto">
                            <NavLink
                                onClick={() => setNavToggle(false)}
                                href={path}
                                activeClassName="text-blue-500"
                                exact={path === "/"}
                            >
                                {title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <div className="dropdown-end dropdown lg:mr-2">
                    <label tabIndex={0} className="btn-ghost btn-circle btn">
                        <div className="indicator">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <span className="badge badge-sm indicator-item bg-primary text-white dark:text-gray-300">
                                {cart.length}
                            </span>
                        </div>
                    </label>
                    <div
                        tabIndex={0}
                        className="card dropdown-content card-compact mt-3 w-52 bg-base-100 shadow"
                    >
                        <div className="card-body">
                            <span className="text-lg font-bold">{cart.length} Items</span>
                            <span className="text-info">Total: ${total.toFixed(2)}</span>
                            <div className="card-actions">
                                <Link href="/checkout" className="block w-full">
                                    <button className="btn-primary btn-block btn">
                                        View cart
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {uid && (
                    <div className="dropdown-end dropdown">
                        <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                            <div className="w-10 rounded-full">
                                <Image
                                    alt="user-logo"
                                    title={displayName}
                                    src={
                                        photoURL ||
                                        "https://i.ibb.co/0QZCv5C/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png"
                                    }
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-full"
                                />
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            className="menu-compact dropdown-content menu rounded-box mt-3 w-52 bg-base-100 p-2 shadow"
                        >
                            <li className="mb-2 mt-1 text-center font-semibold">
                                {displayName}
                            </li>
                            <div className="divider my-0"></div>
                            <li className="mb-2">
                                <NavLink
                                    href="/profile"
                                    className="text-lg"
                                    activeClassName="text-blue-500"
                                >
                                    Profile
                                </NavLink>
                            </li>
                            <li className="">
                                <button
                                    onClick={handleLogout}
                                    className="btn-warning btn content-center text-white"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
                <label className="swap swap-rotate lg:ml-2">
                    <input
                        onChange={toggleTheme}
                        type="checkbox"
                        checked={theme === "dark"}
                    />
                    <svg
                        className="swap-on h-9 w-9 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>
                    <svg
                        className="swap-off h-9 w-9 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                </label>
            </div>
            <label className="swap-rotate swap btn-ghost btn-circle btn ml-2 bg-white dark:bg-slate-800 lg:hidden">
                <input
                    checked={navToggle}
                    onChange={() => setNavToggle((pre) => !pre)}
                    type="checkbox"
                />
                <svg
                    className="swap-off fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 512 512"
                >
                    <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                </svg>
                <svg
                    className="swap-on fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 512 512"
                >
                    <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
            </label>
        </nav>
    );
};

export default Navbar;