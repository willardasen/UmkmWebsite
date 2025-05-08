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

  return (
    <div
      className="w-[800px] h-[600px] mx-auto my-10 px-10 py-8 text-center relative bg-white bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/images/certificate-bg.png')" }}
    >
      <h1 className="text-4xl font-semibold text-blue-900 mb-1">SERTIFIKAT</h1>
      <h2 className="text-2xl text-blue-800 mb-3">NILAI SRL</h2>
      <div className="w-20 h-1 bg-yellow-500 mx-auto mb-4" />
      <p className="text-lg mb-1">DIBERIKAN KEPADA</p>
      <p className="text-2xl font-bold text-gray-800">{umkm.name}</p>
      <p className="text-md text-gray-700 mb-5">{umkm.noBIP}</p>
      <p className="text-lg text-gray-800">
        {umkm.name} memperoleh skor SRL:{" "}
        <span className="font-semibold">{srl.score}</span>
      </p>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <Image
          src="/images/binus-logo.png"
          alt="BINUS University"
          width={140}
          height={50}
        />
      </div>
    </div>
  );
}
