import { CREDIBILITY_ITEMS } from '@/lib/constants'

export default function CredibilityBar() {
  return (
    <section
      className="bg-ifarm-primary py-8"
      aria-label="Diferenciais da plataforma iFarm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-0">
          {CREDIBILITY_ITEMS.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center gap-3 px-4 lg:px-6">
                <span className="text-xl flex-shrink-0" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="text-sm font-medium text-white/90 leading-tight max-w-[180px]">
                  {item.text}
                </span>
              </div>
              {index < CREDIBILITY_ITEMS.length - 1 && (
                <div
                  className="hidden lg:block w-px h-8 bg-white/20 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
