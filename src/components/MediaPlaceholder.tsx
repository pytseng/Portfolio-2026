import { getMediaPlaceholder, type MediaKind } from '../data/mediaPlaceholders'

type Props = {
  /** Must match an entry in src/data/mediaPlaceholders.ts */
  id: string
  /** Optional override caption under the frame */
  caption?: string
}

const KIND_LABEL: Record<MediaKind, string> = {
  video: 'Video placeholder',
  image: 'Image placeholder',
  gif: 'GIF placeholder',
  file: 'File placeholder',
  page: 'Page placeholder',
}

/**
 * Visible stand-in for pytseng.com media that is not hosted / retrievable yet.
 * Search the codebase for the `id` string (or `VIDEO::` / `MEDIA::`) to replace.
 */
export function MediaPlaceholder({ id, caption }: Props) {
  const meta = getMediaPlaceholder(id)
  const label = caption ?? meta.label

  return (
    <figure
      className={`media-placeholder media-placeholder--${meta.kind}`}
      data-media-id={id}
      data-media-kind={meta.kind}
      id={id}
    >
      <div
        className="media-placeholder__frame"
        role="img"
        aria-label={`${KIND_LABEL[meta.kind]}: ${label}`}
      >
        <p className="media-placeholder__eyebrow">{KIND_LABEL[meta.kind]}</p>
        <p className="media-placeholder__id">{id}</p>
        <p className="media-placeholder__label">{label}</p>
        {meta.note ? <p className="media-placeholder__note">{meta.note}</p> : null}
        <p className="media-placeholder__hint">
          Replace when available · see <code>src/data/mediaPlaceholders.ts</code>
        </p>
      </div>
      {caption ? <figcaption className="caption">{caption}</figcaption> : null}
    </figure>
  )
}

/** Backward-compatible alias for video-only call sites */
export function VideoPlaceholder(props: Props) {
  return <MediaPlaceholder {...props} />
}
