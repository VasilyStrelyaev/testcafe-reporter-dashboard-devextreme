import { BrowserInfo } from './types';
import path from 'path';
import { FileExistsMethod } from './types/internal';

export function addArrayValueByKey<T> (collection: Record<string, T[]>, key: string, value: T): void {
    if (!collection[key])
        collection[key] = [value];
    else if (!collection[key].includes(value))
        collection[key].push(value);
};

export function getShouldUploadLayoutTestingData (layoutTestingEnabled: boolean | undefined, browsers: (BrowserInfo & { testRunId: string })[]): boolean {
    return !!layoutTestingEnabled && browsers?.length <= 1;
};

// RegExp by MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
export function escapeForRegExp (inputStr: string): string {
    return inputStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function replaceLast (string: string, search: string, replace: string): string {
    return string.replace(new RegExp(`(${escapeForRegExp(search)})(?!.*\\1)`), replace);
}

export function getPostfixedPath (basePath: string, postfix: string): string {
    return basePath.replace(/\.png$/, `${postfix}.png`);
}

export async function getScreenshotComparerArtifactsPath (fileExists: FileExistsMethod, filePath: string, screenshotsDir: string, destinationDir: string): Promise<string | undefined> {
    if (!filePath.includes(path.normalize(screenshotsDir)))
        return void 0;

    const artifactsPath = replaceLast(filePath, path.normalize(screenshotsDir), path.normalize(destinationDir));

    return await fileExists(artifactsPath) ? artifactsPath : void 0;
}
