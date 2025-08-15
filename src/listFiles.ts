import fs from 'node:fs/promises';
import path from 'node:path';

type ExtensionFilter = string | string[] | undefined;

export default async function listFilesInDirectoryRecursive(
  directoryPath: string,
  extensionFilter?: ExtensionFilter // ".ts", ".js" eller [".ts", ".js"]
): Promise<string[]> {
  let results: string[] = [];

  const entries = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      const subFiles = await listFilesInDirectoryRecursive(fullPath, extensionFilter);
      results = results.concat(subFiles);
    } else {
      if (!extensionFilter) {
        results.push(fullPath);
      } else {
        const filters = Array.isArray(extensionFilter) ? extensionFilter : [extensionFilter];
        if (filters.some(ext => fullPath.endsWith(ext))) {
          results.push(fullPath);
        }
      }
    }
  }

  return results;
}
