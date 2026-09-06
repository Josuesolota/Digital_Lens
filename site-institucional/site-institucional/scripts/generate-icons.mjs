/**
 * Gera todos os ícones da marca (PWA, favicon, Apple, Open Graph) a partir de
 * `brand/logo-source.png`.
 *
 *   node scripts/generate-icons.mjs
 *
 * A lente ocupa um quadrado centrado em (511, 502) com ~647px de diâmetro no
 * ficheiro original de 1024×1024. Recortamos essa área para descartar as marcas
 * de água do canto (badge e sparkle) e ficarmos só com o símbolo.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const SOURCE = "brand/logo-source.png";

// Recorte quadrado centrado na lente, com folga de ~4% para não cortar o anel.
const CROP = { left: 161, top: 152, width: 700, height: 700 };

// Fundo "void" da marca — mesmo valor de --color-void-950 em globals.css.
const VOID = { r: 6, g: 8, b: 15, alpha: 1 };

// A lente ocupa 647 dos 700px do recorte — usamos esse rácio para a máscara.
const LENS_RATIO = 647 / CROP.width;

/**
 * Recorta a lente, redimensiona para `size` e recorta-a a um círculo, para que
 * o fundo cinzento do ficheiro original não deixe um quadrado visível quando a
 * lente é composta sobre o void da marca.
 */
async function lens(size) {
  const radius = (size * LENS_RATIO) / 2;
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="#fff"/></svg>`
  );

  return sharp(SOURCE)
    .extract(CROP)
    .resize(size, size, { fit: "cover" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

/**
 * Ícone quadrado: lente sobre fundo void, ocupando `coverage` do canvas.
 * `coverage` de 0.62 cumpre a zona segura de 80% exigida pelos ícones maskable
 * (Android recorta até 20% de cada lado ao aplicar a máscara do sistema).
 */
async function squareIcon(size, coverage, out) {
  const inner = Math.round(size * coverage);
  const offset = Math.round((size - inner) / 2);
  const buffer = await sharp({
    create: { width: size, height: size, channels: 4, background: VOID },
  })
    .composite([{ input: await lens(inner), left: offset, top: offset }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  await write(out, buffer);
}

async function write(path, buffer) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, buffer);
  console.log(`✓ ${path} (${(buffer.length / 1024).toFixed(1)} kB)`);
}

/** Empacota PNGs num contentor .ico (PNG-in-ICO, suportado por todos os browsers atuais). */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo: ícone
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const directory = entries.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // largura (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // altura
    entry.writeUInt8(0, 2); // paleta
    entry.writeUInt8(0, 3); // reservado
    entry.writeUInt16LE(1, 4); // planos
    entry.writeUInt16LE(32, 6); // bits por pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...directory, ...entries.map((e) => e.data)]);
}

/** Imagem de partilha social 1200×630: lente + wordmark sobre gradiente void. */
async function ogImage() {
  const W = 1200;
  const H = 630;
  const background = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <radialGradient id="glow" cx="27%" cy="50%" r="55%">
          <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.42" />
          <stop offset="55%" stop-color="#2563eb" stop-opacity="0.14" />
          <stop offset="100%" stop-color="#06080f" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#4d8dff" />
          <stop offset="50%" stop-color="#a855f7" />
          <stop offset="100%" stop-color="#e0219f" />
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="#06080f" />
      <rect width="${W}" height="${H}" fill="url(#glow)" />
      <g fill="none" stroke="#8aa0c8" stroke-opacity="0.07" stroke-width="1">
        ${Array.from({ length: 13 }, (_, i) => `<line x1="0" y1="${i * 52.5}" x2="${W}" y2="${i * 52.5}" />`).join("")}
        ${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 52.5}" y1="0" x2="${i * 52.5}" y2="${H}" />`).join("")}
      </g>
      <text x="560" y="268" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="700" fill="#f4f7ff">Digital Lens</text>
      <rect x="562" y="300" width="132" height="4" rx="2" fill="url(#rule)" />
      <text x="562" y="366" font-family="Helvetica, Arial, sans-serif" font-size="29" fill="#9db0cf">Web · Inteligência Artificial</text>
      <text x="562" y="410" font-family="Helvetica, Arial, sans-serif" font-size="29" fill="#9db0cf">Marketing Digital · Locução</text>
      <text x="562" y="486" font-family="Helvetica, Arial, sans-serif" font-size="21" letter-spacing="4" fill="#6d7f9e">SOB UMA SÓ LENTE</text>
    </svg>`);

  const buffer = await sharp(background)
    .composite([{ input: await lens(400), left: 100, top: 115 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  await write("public/og-image.png", buffer);
}

async function main() {
  // Ícones PWA — `any` (com margem discreta) e `maskable` (zona segura de 80%).
  for (const size of [96, 192, 256, 384, 512]) {
    await squareIcon(size, 0.9, `public/icons/icon-${size}.png`);
  }
  await squareIcon(512, 0.62, "public/icons/icon-maskable-512.png");
  await squareIcon(192, 0.62, "public/icons/icon-maskable-192.png");

  // iOS não aplica máscara nem transparência: fundo opaco e margem menor.
  await squareIcon(180, 0.86, "public/apple-touch-icon.png");

  // Convenções de ficheiro do App Router (servidas em /icon e /apple-icon).
  await squareIcon(512, 0.9, "src/app/icon.png");
  await squareIcon(180, 0.86, "src/app/apple-icon.png");

  // Favicon multi-resolução.
  const ico = buildIco(
    await Promise.all(
      [16, 32, 48].map(async (size) => ({
        size,
        data: await sharp({ create: { width: size, height: size, channels: 4, background: VOID } })
          .composite([
            {
              input: await lens(Math.round(size * 0.94)),
              left: Math.round((size - Math.round(size * 0.94)) / 2),
              top: Math.round((size - Math.round(size * 0.94)) / 2),
            },
          ])
          .png({ compressionLevel: 9 })
          .toBuffer(),
      }))
    )
  );
  await write("src/app/favicon.ico", ico);

  await ogImage();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
