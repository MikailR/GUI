import { PERSON } from "../data/content";
import { useOS } from "../os/OSContext";

export function About() {
  const { openApp, toastMsg } = useOS();
  return (
    <div className="app-about">
      <div className="about-hero">
        <div className="about-mark">{PERSON.mark}</div>
        <div>
          <p className="eyebrow">Helios · personal site</p>
          <h1>{PERSON.name}</h1>
          <p className="about-role">
            {PERSON.role}
            <span className="dot" />
            {PERSON.location}
          </p>
        </div>
      </div>
      <blockquote className="pull">{PERSON.quote}</blockquote>
      {PERSON.bio.map((p) => (
        <p key={p} className="about-bio">
          {p}
        </p>
      ))}
      <section>
        <h3>Now</h3>
        <ul className="now-list">
          {PERSON.now.map((row) => (
            <li key={row.k}>
              <span>{row.k}</span>
              <b>{row.v}</b>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Materials</h3>
        <div className="chips">
          {PERSON.skills.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>
      <div className="about-actions">
        <button type="button" className="text-btn" onClick={() => openApp("writing")}>
          Read the essays →
        </button>
        <button type="button" className="text-btn" onClick={() => openApp("lab")}>
          Open the lab →
        </button>
        <button
          type="button"
          className="text-btn"
          onClick={() => toastMsg("This machine stays local — no outbound mail.")}
        >
          Leave a note
        </button>
      </div>
    </div>
  );
}
