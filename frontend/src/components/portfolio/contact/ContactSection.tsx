import { CONTACT_DETAILS } from './data';
import { ContactDetailItem } from './ContactDetailItem';

export function ContactSection() {
  return (
    <>
      <div className="section-header reveal">
        <div className="section-eyebrow">Connect</div>
        <h2 className="section-title">
          Get In <span className="grad">Touch</span>
        </h2>
      </div>

      <div className="contact-card reveal-scale">
        {CONTACT_DETAILS.map((detail) => (
          <ContactDetailItem key={detail.id} detail={detail} />
        ))}
      </div>
    </>
  );
}
