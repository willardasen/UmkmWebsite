import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
         <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Logo UMKM"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>
        <h1 className="text-5xl font-bold">Aplikasi peminjaman untuk UMKM</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Platform yang dapat membantu pemilik UMKM untuk mengajukan pinjaman dan menilai kesiapan bisnis mereka.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="btn btn-primary rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
