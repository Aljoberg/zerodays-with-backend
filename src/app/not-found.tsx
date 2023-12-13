import Image from "next/image";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen flex-col bg-black">
            <h1 className="font-extrabold text-4xl md:text-6xl text-white tracking-widest">404</h1>
            <p className="text-xl md:text-3xl text-gray-100 font-semibold mb-5">PAGE NOT FOUND!</p>
            <div className="shadow-lg p-5 bg-white rounded-lg">
                <Image
                    src="https://img.jagranjosh.com/images/2022/November/2112022/wonderopolisCANVA_11zon.jpg"
                    width={700}
                    height={400}
                    alt="ostrich"
                    className="rounded-lg"
                />
            </div>
            <div className="text-white">
                <h2 className="text-2xl font-semibold mt-5">Life is not fair.</h2>
                <h3 className="text-xl mt-2">But... don't lose fate.</h3>
                <h4 className="text-lg mt-1 mb-5">Good luck! 😉</h4>
            </div>
        </div>
        
    )
}
