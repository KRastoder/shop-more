export default function DiscountBar() {
  return (
    <div className="bg-black text-white flex items-center justify-center py-3">
      <p>
        Sign up and get 20% off your first order.{" "}
        <a href="/sign-up" className="underline">
          Sign Up Now
        </a>
      </p>
    </div>
  );
}
