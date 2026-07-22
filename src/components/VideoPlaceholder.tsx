import { getVideoPlaceholder } from '../data/videoPlaceholders'

type Props = {
  /** Must match an entry in src/data/videoPlaceholders.ts */
  id: string
  /** Optional override caption under the frame */
  caption?: string
}

/**
 * Visible stand-in for a pytseng.com video that is not hosted yet.
 * Search the codebase for the `id` string (or `VIDEO::`) to replace later.
 */
export function VideoPlaceholder({ id, caption }: Props) {
  const meta = getVideoPlaceholder(id)
  const label = caption ?? meta.label

  return (
    <figure className="video-placeholder" data-video-id={id} id={id}>
      <div className="video-placeholder__frame" role="img" aria-label={`Video placeholder: ${label}`}>
        <p className="video-placeholder__eyebrow">Video placeholder</p>
        <p className="video-placeholder__id">{id}</p>
        <p className="video-placeholder__label">{label}</p>
        <p className="video-placeholder__hint">
          Replace when hosted · see <code>src/data/videoPlaceholders.ts</code>
        </p>
      </div>
      {caption ? <figcaption className="caption">{caption}</figcaption> : null}
    </figure>
  )
}
