import { prisma } from "../../../../prisma/client";

export default async function CertificatePage(context: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await context.params;
  const umkm = await prisma.uMKM.findUnique({
    where: { id },
  });

  const srl = await prisma.sRLAssessment.findUnique({
    where: { umkmId: id},
  });

  if (!umkm || !srl) return <div>Data not found</div>;

  return (
    <div
      style={{
        width: "800px",
        height: "600px",
        padding: "40px",
        backgroundColor: "#fef8e7",
        fontFamily: "sans-serif",
        textAlign: "center",
        border: "2px solid #ccc",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "20px", color: "#333" }}>
        Sertifikat Nilai SRL
      </h1>
      <p style={{ fontSize: "18px", marginBottom: "12px" }}>
        Diberikan kepada:
      </p>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>{umkm.name}</p>
      <p style={{ marginBottom: "12px" }}>{umkm.noBIP}</p>
      <p style={{ fontSize: "20px", marginTop: "30px" }}>
        Dengan Skor SRL: <strong>{srl.score}</strong>
      </p>
    </div>
  );
}
