import { BEFORE_AFTER } from '@/lib/constants'

export default function BeforeAfterSection() {
  return (
    <section
      className="bg-ifarm-surface section-padding"
      aria-labelledby="before-after-title"
    >
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            id="before-after-title"
            className="text-3xl sm:text-4xl font-extrabold text-ifarm-on-surface mb-4"
          >
            O agro não precisa mais operar no improviso.
          </h2>
          <p className="text-lg text-ifarm-on-surface-variant max-w-xl mx-auto">
            Da gestão fragmentada para o ecossistema integrado. Veja a diferença na prática.
          </p>
        </div>

        {/* Before/After table */}
        <div className="max-w-3xl mx-auto">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 mb-4">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-ifarm-error/10 text-ifarm-error rounded-pill text-sm font-semibold">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="2" y1="2" x2="12" y2="12" />
                  <line x1="12" y1="2" x2="2" y2="12" />
                </svg>
                Antes
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="w-8 h-8 flex items-center justify-center" aria-hidden="true" />
            </div>
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-ifarm-primary-fixed text-ifarm-primary rounded-pill text-sm font-semibold">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="2 7 5 10 12 3" />
                </svg>
                iFarm
              </span>
            </div>
          </div>

          {/* Rows */}
          <div className="space-y-3">
            {BEFORE_AFTER.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center"
              >
                {/* Before */}
                <div className="bg-white rounded-card p-4 shadow-card border border-ifarm-error/10">
                  <p className="text-sm text-ifarm-on-surface-variant leading-relaxed">
                    {item.before}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="#707A70"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h12M12 6l4 4-4 4" />
                  </svg>
                </div>

                {/* After */}
                <div className="bg-ifarm-primary-fixed/30 rounded-card p-4 border border-ifarm-primary/10">
                  <p className="text-sm text-ifarm-primary font-medium leading-relaxed">
                    {item.after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
