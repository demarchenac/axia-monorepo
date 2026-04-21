type Props = {
  src: string
  overlay?: 'light' | 'dark'
  children: React.ReactNode
}

export function VideoHero({ src, overlay = 'dark', children }: Props) {
  const overlayClass =
    overlay === 'dark'
      ? 'bg-black/50'
      : 'bg-white/40'

  return (
    <section className="relative min-h-dvh flex items-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="relative z-10 w-full">{children}</div>
    </section>
  )
}
