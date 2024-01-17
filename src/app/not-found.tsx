import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black">
      <h1 className="text-4xl font-extrabold tracking-widest text-white md:text-6xl">
        404
      </h1>
      <p className="mb-5 text-xl font-semibold text-gray-100 md:text-3xl">
        PAGE NOT FOUND!
      </p>
      <div className="rounded-lg bg-white p-5 shadow-lg">
        <Image
          src="https://img.jagranjosh.com/images/2022/November/2112022/wonderopolisCANVA_11zon.jpg"
          width={700}
          height={400}
          alt="ostrich"
          className="rounded-lg"
        />
      </div>
      <div className="text-white">
        <h2 className="mt-5 text-2xl font-semibold">Life is not fair.</h2>
        <h3 className="mt-2 text-xl">But... don't lose fate.</h3>
        <h4 className="mb-5 mt-1 text-lg">Good luck! 😉</h4>
      </div>
    </div>
  );
}
