type Props = {
  src: string
  poster?: string
  caption?: string
  label: string
}

/** Autoplaying, UI-hidden case-study video (matches README / pytseng native players). */
export function CaseStudyVideo({ src, poster, caption, label }: Props) {
  return (
    <figure>
      <div className="media-frame media-frame--video media-frame--video-cover">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={label}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      {caption ? <figcaption className="caption">{caption}</figcaption> : null}
    </figure>
  )
}
