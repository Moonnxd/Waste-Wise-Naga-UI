import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(here, "requests.json");
let requests = [];

export async function loadRequests() {
  try {
    requests = JSON.parse(await fs.readFile(dataFile, "utf8"));
    if (!Array.isArray(requests)) requests = [];
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await saveRequests();
  }
}

export function listRequests() {
  return [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addRequest(request) {
  requests.unshift(request);
  await saveRequests();
  return request;
}

async function saveRequests() {
  await fs.writeFile(dataFile, `${JSON.stringify(requests, null, 2)}\n`, "utf8");
}
