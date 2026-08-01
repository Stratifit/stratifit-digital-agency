import { getAdminMedia } from "@/features/media/queries";
import { deleteMediaAsset } from "@/features/media/mutations";
import { getMediaPublicUrl } from "@/lib/media";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { MediaUploadForm } from "@/components/admin/media/media-upload-form";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  const media = await getAdminMedia();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          Media Library
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Upload and manage images, logos, and visual assets.
        </p>
      </div>

      <MediaUploadForm />

      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary">
          All Assets ({media.length})
        </h2>

        {media.length === 0 ? (
          <div className="mt-4 rounded-radius-md border border-border bg-surface p-10 text-center">
            <p className="text-sm text-text-secondary">No media assets yet.</p>
            <p className="mt-1 text-sm text-text-muted">
              Upload your first image using the form above.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media.map((asset) => {
              const url = getMediaPublicUrl(
                asset.bucket_name,
                asset.storage_path
              );
              const altText = resolveTranslation(
                asset.alt_text_translations,
                "en"
              );

              return (
                <div
                  key={asset.id}
                  className="group overflow-hidden rounded-radius-md border border-border bg-surface transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-border-interactive"
                >
                  <div className="relative aspect-video overflow-hidden bg-background-deep">
                    {url && asset.mime_type.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={altText || asset.original_filename}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-text-muted">
                        <span className="text-sm">{asset.mime_type}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 p-4">
                    <p
                      className="truncate text-sm font-medium text-text-primary"
                      title={asset.original_filename}
                    >
                      {asset.original_filename}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="neutral">{asset.category}</Badge>
                      <Badge variant="information">{asset.bucket_name}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{formatFileSize(asset.file_size_bytes)}</span>
                      {asset.width && asset.height ? (
                        <span>
                          {asset.width} x {asset.height}
                        </span>
                      ) : null}
                    </div>

                    {altText ? (
                      <p className="truncate text-xs text-text-secondary" title={altText}>
                        Alt: {altText}
                      </p>
                    ) : (
                      <p className="text-xs text-text-subtle">No alt text</p>
                    )}

                    <div className="flex justify-end pt-2">
                      <ConfirmDelete
                        action={deleteMediaAsset.bind(null, asset.id)}
                        title="Delete media asset"
                        description={`This will permanently delete "${asset.original_filename}" from storage and the database.`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
