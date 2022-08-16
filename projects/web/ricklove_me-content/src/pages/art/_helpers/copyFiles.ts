import { artworkList as artworkListRaw } from '@ricklove/art-build';
import { copyFiles, joinPathNormalized } from '@ricklove/utils-files';
import { getMonoRepoRoot, getWebProjectPath } from '../../../components/paths';

const getPaths = async () => {
  const monoRepoRoot = await getMonoRepoRoot();

  const artworkPath = joinPathNormalized(monoRepoRoot, `./projects/art/artwork`);
  const publicPath = joinPathNormalized(await getWebProjectPath(), `./public`);
  const publicArtworkRelativePath = `/_media/artwork`;

  return {
    artworkPath,
    publicPath,
    publicArtworkRelativePath,
  };
};

export const copyArtPreviewFilesToPublic = async () => {
  const { artworkPath, publicPath, publicArtworkRelativePath } = await getPaths();

  for (const a of artworkListRaw) {
    console.log(`copyArtPreviewFilesToPublic`, { a });
    await copyFiles({
      sourcePath: joinPathNormalized(artworkPath, a.artworkDirectoryName, `./.art-output/preview`),
      destPath: joinPathNormalized(publicPath, publicArtworkRelativePath, a.key),
    });
  }
};
