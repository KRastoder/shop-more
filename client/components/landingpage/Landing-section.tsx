import Image from "next/image";
export default function LandingSection() {
  return (
    <div className="bg-second flex items-center justify-center">
      <div className="flex w-9/10">
        {/* LEFT SIDE */}
        <div className="w-1/2 flex flex-col gap-10 py-20">
          <div className="flex flex-col gap-8 items-start">
            <h1 className="font-extrabold text-[64px] leading-[1.1]">
              FIND CLOTHES
              <br />
              THAT MATCHES
              <br />
              YOUR STYLE
            </h1>

            <p className="text-[22px]">
              Browse through our diverce range of meticulosly crafted garments
              designed <br />
              to bring out your individuality and cater to your sense of style
            </p>

            <a
              href="/shop"
              className="inline-block bg-black text-white py-4 px-10 rounded-4xl font-bold"
            >
              Shop now
            </a>
          </div>
          <div className="flex justify-between text-6xl">
            <p className="leading-8">
              200+
              <br />
              <small className="text-gray-700 text-xl">
                International Brands
              </small>
            </p>
            <div className="w-px bg-gray-200"></div>
            <p className="leading-8">
              2,000+
              <br />
              <small className="text-gray-700 text-xl">
                International Brands
              </small>
            </p>
            <div className="w-px bg-gray-200"></div>
            <p className="leading-8">
              30,000+
              <br />
              <small className="text-gray-700 text-xl">
                International Brands
              </small>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 relative flex items-end justify-center overflow-hidden">
          <div className="w-[90%]">
            <Image
              alt="clothes"
              src="/tshirt.png"
              width={1000}
              height={1000}
              className="w-full h-auto object-contain "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
