import axios from 'axios';

export interface NpmPackageLatestResponse {
  name: string;
  version: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Fetches the latest published version of an npm package using Axios.
 * @param packageName Name of the npm package (defaults to 'create-morax')
 * @returns Formatted version string, e.g. 'v0.1.0' or null if not fetched
 */
export const getNpmLatestVersion = async (
  packageName = 'create-morax',
): Promise<string | null> => {
  try {
    const response = await axios.get<NpmPackageLatestResponse>(
      `https://registry.npmjs.org/${packageName}/latest`,
      {
        timeout: 5000,
      },
    );

    if (response.data?.version) {
      return `v${response.data.version}`;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch version for ${packageName}:`, error);
    return null;
  }
};
