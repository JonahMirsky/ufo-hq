export function SectionHead({
  num,
  sub,
  title,
  titleEm,
  lede,
  actions,
}: {
  num: string;
  sub: string;
  title: string;
  titleEm?: string;
  lede: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="sec-head">
      <div className="sec-head-rail">
        <div className="sec-num">{num}</div>
        <div className="sec-sub">{sub}</div>
      </div>
      <div className="sec-head-mid">
        <h2>
          {title} {titleEm && <em>{titleEm}</em>}.
        </h2>
        <p>{lede}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : <div />}
    </div>
  );
}
