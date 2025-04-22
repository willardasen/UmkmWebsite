import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold">UMKM Loan System</h1>
        <p className="text-xl max-w-2xl mx-auto">
          A comprehensive platform for UMKM owners to apply for loans and assess
          their business readiness.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="btn btn-primary rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Login
          </Link>
          {/* <Link href="/auth/register" className="btn btn-outline">
            Register
          </Link> */} 
        </div>
      </div>
    </div>
  );
}
