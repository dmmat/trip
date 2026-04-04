// Password hashing using Web Crypto API (available in Cloudflare Workers)

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  const exported = await crypto.subtle.exportKey('raw', key);
  const saltHex = bufToHex(salt);
  const hashHex = bufToHex(new Uint8Array(exported));
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password, storedHash) {
  const [saltHex, hashHex] = storedHash.split(':');
  const salt = hexToBuf(saltHex);
  const key = await deriveKey(password, salt);
  const exported = await crypto.subtle.exportKey('raw', key);
  const computedHex = bufToHex(new Uint8Array(exported));
  return computedHex === hashHex;
}

async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export function generateId() {
  return crypto.randomUUID();
}

export function generateToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return bufToHex(bytes);
}

function bufToHex(buf) {
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBuf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
