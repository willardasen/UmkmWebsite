import { prisma } from "../../../../prisma/client";
import Image from "next/image";

export default async function CertificatePage(context: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await context.params;

  const umkm = await prisma.uMKM.findUnique({
    where: { id },
  });

  const srl = await prisma.sRLAssessment.findUnique({
    where: { umkmId: id },
  });

  if (!umkm || !srl)
    return <div className="text-center text-red-600">Data not found</div>;

  const getSRLLabel = (score: number) => {
    if (score === 6) return { label: "Bad", color: "text-red-600" };
    if (score === 7) return { label: "Good", color: "text-yellow-600" };
    if (score === 8) return { label: "Very Good", color: "text-blue-600" };
    if (score === 9) return { label: "Excellent", color: "text-green-600" };
    return { label: "Tidak Diketahui", color: "text-gray-600" };
  };

  const { label, color } = getSRLLabel(srl.score ?? -1);

  return (
    <div
      className="w-[21cm] h-[29.7cm] px-0"
      style={{
        backgroundImage: "url('/images/background-sertif.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center justify-center h-full px-10 text-center">
        <h1 className="text-4xl font-semibold text-blue-900 mb-1">
          SERTIFIKAT
        </h1>
        <h2 className="text-2xl text-blue-800 mb-3">NILAI SRL</h2>
        <div className="w-20 h-1 bg-yellow-500 mx-auto mb-4" />
        <p className="text-lg mb-1">DIBERIKAN KEPADA</p>
        <p className="text-2xl font-bold text-gray-800">{umkm.name}</p>
        <p className="text-md text-gray-700 mb-5">{umkm.noNIB}</p>
        <p className="text-lg text-gray-800">
          {umkm.name} memperoleh skor SRL:{" "}
          <span className="font-semibold">{srl.score}</span>
        </p>
        <p className={`mt-2 text-4xl font-medium ${color}`}>
          Hasil SRL: {label}
        </p>

        <div className="mt-12">
          <Image
            src="/images/binus-logo.png"
            alt="BINUS University"
            width={140}
            height={50}
          />
        </div>
      </div>
    </div>
  );
}
