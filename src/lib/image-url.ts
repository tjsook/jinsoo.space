export function normalizePublicImageUrl(url: string) {
  if (!url) {
    return url;
  }

  function toDriveThumbnail(fileId: string) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
  }

  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);

  if (driveFileMatch) {
    return toDriveThumbnail(driveFileMatch[1]);
  }

  const driveOpenMatch = url.match(/[?&]id=([^&]+)/);

  if (
    url.includes("drive.google.com") &&
    driveOpenMatch
  ) {
    return toDriveThumbnail(driveOpenMatch[1]);
  }

  return url;
}
