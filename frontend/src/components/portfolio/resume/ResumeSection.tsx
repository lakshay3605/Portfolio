import { RESUME_FILE, RESUME_SECTION } from './data';

export function ResumeSection() {
  return (
    <div className="resume-banner reveal">
      <div className="resume-inner">
        <p>{RESUME_SECTION.description}</p>
        <div className="resume-btns">
          <a
            href={encodeURI(RESUME_FILE.downloadUrl)}
            download={RESUME_FILE.fileName}
            className="btn-custom btn-primary-custom"
            aria-label="Download resume as PDF"
          >
            Download Resume
          </a>
          <a
            href={encodeURI(RESUME_FILE.downloadUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-custom btn-secondary-custom"
            aria-label="Preview resume in a new tab"
          >
            Preview Resume
          </a>
        </div>
      </div>
    </div>
  );
}
