export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import prisma from "../../../../lib/prisma";

export async function DELETE(req, { params }) {
  const { code } = params;

  try {
    await prisma.link.delete({
      where: { code },
    });

    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return new Response("Not found", { status: 404 });
  }
}

export async function GET(req, { params }) {
  const { code } = params;
  const link = await prisma.link.findUnique({
    where: { code },
  });
  ``
  if (!link) return new Response("Not found", { status: 404 });

  return new Response(JSON.stringify(link), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(req, { params }) {
  const { code } = params;
  const link = await prisma.link.findUnique({
    where: { code },
  });

  const update = Number(link.clicks + 1);

  const clicked = Date.now()

  const updated = await prisma.link.update({
    where: { code },
    data: {
      clicks: update,
    }

  })

  console.log("Updated", updated)
  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
