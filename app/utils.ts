/**
 * Hash some text using Sha-256.
 * NOTE: This is bad; don't do this; use bcrypt instead.
 */
export async function unsafeHash(
  input: string,
  algorithm: AlgorithmIdentifier = "SHA-256"
) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
