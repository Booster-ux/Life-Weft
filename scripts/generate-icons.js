// Pure Node.js PNG icon generator (No external dependencies needed)
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// CRC32 implementation
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    CRC_TABLE[n] = c;
}

function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
        c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, "ascii");
    data.copy(buf, 8);
    const crcVal = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crcVal, 8 + len);
    return buf;
}

function encodeRGBA(width, height, getPixel) {
    const rawBytes = Buffer.alloc((width * 4 + 1) * height);
    let offset = 0;

    for (let y = 0; y < height; y++) {
        rawBytes[offset++] = 0; // Filter: None
        for (let x = 0; x < width; x++) {
            const [r, g, b, a] = getPixel(x, y, width, height);
            rawBytes[offset++] = Math.max(0, Math.min(255, Math.round(r)));
            rawBytes[offset++] = Math.max(0, Math.min(255, Math.round(g)));
            rawBytes[offset++] = Math.max(0, Math.min(255, Math.round(b)));
            rawBytes[offset++] = Math.max(0, Math.min(255, Math.round(a)));
        }
    }

    const compressed = zlib.deflateSync(rawBytes, { level: 9 });

    // PNG Signature
    const signature = Buffer.from([137, 80, 78, 72, 13, 10, 26, 10]);

    // IHDR
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // RGBA color type
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    const chunks = [
        signature,
        createChunk("IHDR", ihdr),
        createChunk("IDAT", compressed),
        createChunk("IEND", Buffer.alloc(0))
    ];

    return Buffer.concat(chunks);
}

function renderIcon(width, height, isMaskable = false) {
    const rxRatio = isMaskable ? 0.0 : 0.22;
    const cornerRadius = width * rxRatio;

    return encodeRGBA(width, height, (x, y, w, h) => {
        // Center normalized coordinates [0, 1]
        const nx = x / w;
        const ny = y / h;

        // Rounded rect distance for non-maskable
        if (!isMaskable) {
            const dx = Math.max(0, Math.max(cornerRadius - x, x - (w - cornerRadius)));
            const dy = Math.max(0, Math.max(cornerRadius - y, y - (h - cornerRadius)));
            if (dx > 0 && dy > 0 && Math.sqrt(dx * dx + dy * dy) > cornerRadius) {
                return [0, 0, 0, 0]; // transparent
            }
        }

        // Background Gradient: #1E3A8A (top-left) to #0A0D14 (bottom-right)
        const t = (nx + ny) / 2;
        let r = 30 * (1 - t) + 10 * t;
        let g = 58 * (1 - t) + 13 * t;
        let b = 138 * (1 - t) + 20 * t;
        let a = 255;

        // Border stroke for standard icon
        if (!isMaskable && (x <= 4 || x >= w - 5 || y <= 4 || y >= h - 5)) {
            return [59, 130, 246, 120];
        }

        // Monogram "L" coordinates (normalized to box)
        // Vertical stem: x in [0.28, 0.40], y in [0.22, 0.74]
        // Horizontal foot: x in [0.28, 0.68], y in [0.63, 0.74]
        const inStem = nx >= 0.28 && nx <= 0.40 && ny >= 0.22 && ny <= 0.74;
        const inFoot = nx >= 0.28 && nx <= 0.68 && ny >= 0.63 && ny <= 0.74;

        if (inStem || inFoot) {
            return [255, 255, 255, 255];
        }

        // Accent line next to monogram
        const inAccent = nx >= 0.41 && nx <= 0.43 && ny >= 0.22 && ny <= 0.62;
        if (inAccent) {
            return [59, 130, 246, 200];
        }

        // Golden Sparkle / Star at top right: center at (0.70, 0.29)
        const starCx = 0.70;
        const starCy = 0.29;
        const distToStar = Math.sqrt((nx - starCx) * (nx - starCx) + (ny - starCy) * (ny - starCy));

        if (distToStar <= 0.08) {
            // Gold gradient glow
            const starT = distToStar / 0.08;
            return [
                253 * (1 - starT) + 217 * starT,
                224 * (1 - starT) + 119 * starT,
                71 * (1 - starT) + 6 * starT,
                255
            ];
        }

        return [r, g, b, a];
    });
}

const iconsDir = path.join(__dirname, "..", "public", "icons");
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

console.log("Generating PWA Icons...");

fs.writeFileSync(path.join(iconsDir, "icon-192.png"), renderIcon(192, 192, false));
fs.writeFileSync(path.join(iconsDir, "icon-512.png"), renderIcon(512, 512, false));
fs.writeFileSync(path.join(iconsDir, "icon-maskable-192.png"), renderIcon(192, 192, true));
fs.writeFileSync(path.join(iconsDir, "icon-maskable-512.png"), renderIcon(512, 512, true));
fs.writeFileSync(path.join(iconsDir, "apple-touch-icon.png"), renderIcon(180, 180, false));

console.log("All PWA icons generated successfully in public/icons!");
