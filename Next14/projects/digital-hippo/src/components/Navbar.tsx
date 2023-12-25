// @flow
import { Cart } from "@/components/Cart";
import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import NavItems from "@/components/NavItems";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";

const Navbar = () => {
  const user = null;

  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center ">
              {/* TODO: Mobile nav */}

              <div className="ml-4 flex lg:li-0">
                <Link href={"/"}>
                  <Icons.logo className="w-8 h-8" />
                </Link>
              </div>

              {/*   NavItems */}
              <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch ">
                <NavItems />
              </div>

              {/*  Signin Signup  */}
              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {user ? null : (
                    <Link
                      href="/sign-in"
                      className={buttonVariants({
                        variant: "ghost",
                      })}
                    >
                      Sign in
                    </Link>
                  )}

                  {user ? null : (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  )}

                  {user ? (
                    "user"
                  ) : (
                    <Link
                      href="/sign-up"
                      className={buttonVariants({
                        variant: "ghost",
                      })}
                    >
                      Create account
                    </Link>
                  )}

                  {user ? (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  ) : null}

                  {user ? null : (
                    <div className="flex lg:ml-6">
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  {/* https://tailwindcss.com/docs/display
                   * The 'flow-root' class in Tailwind CSS creates a new
                   * block formatting context. This is a bit like creating
                   * an invisible boundary around the element with this
                   * class.
                   * In simpler terms, imagine you have a box (the div with
                   * flow-root), and inside this box, you have some floating
                   * elements (elements that are pushed to the left or right
                   * of their container). These floating elements will stay
                   * within the box and won't affect anything outside the
                   * box.
                   * So, if you have other elements around the box, they
                   * won't be disturbed or moved around by the floating
                   * elements inside the box. This is useful when you want
                   * to control the layout of your page and prevent
                   * unexpected shifts in your design.
                   */}
                  <div className="ml-4 flow-root lg:ml-6">
                    <Cart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;