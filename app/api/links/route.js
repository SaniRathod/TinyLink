import prisma from "../../../lib/prisma";

function randomCode(len = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
function isValidCustomCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function GET(req, context) {
  const links = await prisma.link.findMany({ orderBy: { createdAt: "desc" } });
  return new Response(JSON.stringify(links), { status: 200, headers: { "content-type": "application/json" } });
}

export async function POST(req) {
  const body = await req.json();
  const { url, code: customCode } = body ?? {};

  if (!url || !isValidUrl(url)) {
    return new Response(JSON.stringify({ error: "Invalid or missing URL" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  let code = customCode;
  if (code) {
    if (!isValidCustomCode(code)) {
      return new Response(JSON.stringify({ error: "Custom code must match [A-Za-z0-9]{6,8}" }), { status: 400, headers: { "content-type": "application/json" } });
    }
    const exists = await prisma.link.findUnique({ where: { code } });
    if (exists) {
      return new Response(JSON.stringify({ error: "Code already exists" }), { status: 409, headers: { "content-type": "application/json" } });
    }
  } else {
    // generate unique code (retry loop)
    let tries = 0;
    do {
      code = randomCode(6);
      const e = await prisma.link.findUnique({ where: { code } });
      if (!e) break;
      tries++;
    } while (tries < 5);
    // if still collides, try longer code
    if (!code) code = randomCode(7);
  }

  const created = await prisma.link.create({
    data: { code, url }
  });

  return new Response(JSON.stringify(created), { status: 201, headers: { "content-type": "application/json" } });
}
