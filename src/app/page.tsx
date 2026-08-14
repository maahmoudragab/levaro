import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image
          src="/logo.png"
          alt="LÉVARO Logo"
          width={200}
          height={200}
          className="rounded-full"
        />
        <h1 className="text-4xl font-bold ">
          Welcome to LÉVARO
        </h1>
        <p className="text-lg text-gray-600">
          Your one-stop solution for all your needs.
        </p>
      </div>
    </div>
  );
}
