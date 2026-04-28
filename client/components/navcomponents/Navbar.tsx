import Link from "next/link";
import DiscountBar from "./discount-bar";
import { CircleUser, ShoppingCart, ChevronDown } from "lucide-react";
export default function NavBar() {
  return (
    <nav className="flex flex-col justify-center items-center border-b border-second">
      <div className="w-full">
        <DiscountBar />
      </div>
      <div className="flex w-9/10 py-5 justify-between items-center">
        <div className="flex gap-7">
          <h1 className="text-black font-extrabold text-3xl text-center">
            SHOP.MORE
          </h1>
          <ul className="flex items-center gap-4">
            <li>
              <Link href="" className="flex">
                Shop <ChevronDown />
              </Link>
            </li>
            <li>
              <Link href="">On Sale</Link>
            </li>
            <li>
              <Link href="">New Arivals</Link>
            </li>
            <li>
              <Link href="">Brands</Link>
            </li>
          </ul>
        </div>
        <div className="flex gap-5">
          <ShoppingCart />
          <CircleUser />
        </div>
      </div>
    </nav>
  );
}
