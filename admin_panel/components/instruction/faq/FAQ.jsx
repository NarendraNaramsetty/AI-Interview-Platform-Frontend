import { useState } from 'react';
import styles from './FAQ.module.css';

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const faqs = [
    {
      id: 'q1',
      question: 'What are the important guidelines for check-in, check-out, and volunteering hours?',
      answer: (
        <>
          <div className={styles.mandatoryBadge}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Mandatory Guidelines
          </div>
          <p className={styles.faqAnswer}>
            <strong>Please read these important guidelines carefully:</strong>
          </p>
          <ul className={styles.steps}>
            <li>
              <span className={styles.stepNum}>1</span>
              <span>
                <strong>Daily Check-in & Check-out:</strong> Student check-in and check-out is{' '}
                <strong>mandatory every day</strong> for all events.
              </span>
            </li>
            <li>
              <span className={styles.stepNum}>2</span>
              <span>
                <strong>Timing Requirements:</strong> Students must check-in{' '}
                <strong>only within the event start time</strong> and check-out{' '}
                <strong>before the event end time</strong>.
              </span>
            </li>
            <li>
              <span className={styles.stepNum}>3</span>
              <span>
                <strong>Early Check-in Not Allowed:</strong> Check-in before the event start time
                will <strong>not be allowed</strong>.
              </span>
            </li>
            <li>
              <span className={styles.stepNum}>4</span>
              <span>
                <strong>Late Check-out Not Counted:</strong> Check-out after the event end time will{' '}
                <strong>not be considered</strong>.
              </span>
            </li>
            <li>
              <span className={styles.stepNum}>5</span>
              <span>
                <strong>Check-out is Critical:</strong> If a student forgets to check-out,{' '}
                <strong>only 2 volunteering hours will be credited</strong> irrespective of the
                actual volunteering duration.
              </span>
            </li>
            <li>
              <span className={styles.stepNum}>6</span>
              <span>
                <strong>Multi-day Events:</strong> For events running multiple days, students must
                complete <strong>check-in and check-out every day</strong> within the specified
                timings.
                <br />
                <em>Example:</em> If an event runs for 6 days, students must complete{' '}
                <strong>6 check-ins and 6 check-outs</strong> (one for each day).
              </span>
            </li>
            <li>
              <span className={styles.stepNum}>7</span>
              <span>
                <strong>Geo-tagged Photos:</strong> Students are requested to upload{' '}
                <strong>proper geo-tagged photos</strong> wherever applicable for participation
                verification.
              </span>
            </li>
          </ul>
          <p className={styles.faqAnswer} style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <strong>Important:</strong> Failure to follow these guidelines may result in incorrect
            volunteering hour calculations or rejection of participation records.
          </p>
        </>
      ),
    },
    {
      id: 'q2',
      question: 'How to create an event and Give an Example?',
      answer: (
        <>
          {/* Multiple Days Event Example */}
          <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderLeft: '4px solid #0ea5e9', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
            <p className={styles.faqAnswer} style={{ marginBottom: '12px' }}>
              <strong>💡 Example: Multiple Days Event</strong>
            </p>
            <p className={styles.faqAnswer} style={{ marginBottom: '12px' }}>
              If the event should run daily from <strong>9:00 AM to 5:00 PM</strong> between <strong>Aug 10 2026 and Aug 15 2026</strong>, set:
            </p>
            <ul className={styles.steps}>
              <li><span className={styles.stepNum}>•</span><span><strong>From Date</strong> → Aug 10 2026</span></li>
              <li><span className={styles.stepNum}>•</span><span><strong>To Date</strong> → Aug 15 2026</span></li>
              <li><span className={styles.stepNum}>•</span><span><strong>Daily Start Time</strong> → 9:00 AM</span></li>
              <li><span className={styles.stepNum}>•</span><span><strong>Daily End Time</strong> → 17:00 (5 PM) <em>(As we are maintaining 24 hours format)</em></span></li>
            </ul>
            <p className={styles.faqAnswer} style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(14, 165, 233, 0.2)' }}>
              <strong>This means:</strong>
            </p>
            <ul className={styles.steps}>
              <li><span className={styles.stepNum}>✓</span><span>The event is available from <strong>Aug 10 2026 to Aug 15 2026</strong></span></li>
              <li><span className={styles.stepNum}>✓</span><span>Every day the event will run only between <strong>9:00 AM and 17:00 (5 PM)</strong></span></li>
              <li><span className={styles.stepNum}>⚠️</span><span><strong>Students can check-in and check-out only within these daily timings.</strong></span></li>
            </ul>
          </div>

          {/* One-Day Event Example */}
          <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '8px' }}>
            <p className={styles.faqAnswer} style={{ marginBottom: '12px' }}>
              <strong>💡 Example: One-Day Event</strong>
            </p>
            <p className={styles.faqAnswer} style={{ marginBottom: '12px' }}>
              If the event should run only on <strong>Aug 10 2026 from 9:00 AM to 17:00 (5 PM)</strong>, set:
            </p>
            <ul className={styles.steps}>
              <li><span className={styles.stepNum}>•</span><span><strong>From Date</strong> → Aug 10 2026</span></li>
              <li><span className={styles.stepNum}>•</span><span><strong>To Date</strong> → Aug 10 2026</span></li>
              <li><span className={styles.stepNum}>•</span><span><strong>Daily Start Time</strong> → 9:00 AM</span></li>
              <li><span className={styles.stepNum}>•</span><span><strong>Daily End Time</strong> → 17:00 (5 PM) <em>(As we are maintaining 24 hours format)</em></span></li>
            </ul>
            <p className={styles.faqAnswer} style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <strong>This means:</strong>
            </p>
            <ul className={styles.steps}>
              <li><span className={styles.stepNum}>✓</span><span>The event is available only on <strong>Aug 10 2026</strong>.</span></li>
              <li><span className={styles.stepNum}>✓</span><span>The event will run only between <strong>9:00 AM and 17:00 (5 PM)</strong></span></li>
              <li><span className={styles.stepNum}>⚠️</span><span><strong>Students can check-in and check-out only within these timings.</strong></span></li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 'q3',
      question: 'I am not able to receive the OTP. What should I do?',
      answer: (
        <p className={styles.faqAnswer}>
          Ensure you enter your mobile number correctly and check your email — including the{' '}
          <strong>spam/junk folder</strong> — for the OTP. If you still do not receive it, contact
          your college coordinator, who can update your registered email ID in the Mango dashboard.
          After the update, try logging in again.
        </p>
      ),
    },
    {
      id: 'q4',
      question: 'Which email ID will I receive the OTP on?',
      answer: (
        <p className={styles.faqAnswer}>
          The OTP will be sent to your <strong>registered email ID</strong> in the Mango system. If
          you are unsure which email ID is registered, contact your college coordinator for
          confirmation or to request an update.
        </p>
      ),
    },
    {
      id: 'q5',
      question: 'What should I do if I am not able to see the VTU tile in Campus.Life?',
      answer: (
        <p className={styles.faqAnswer}>
          If you are not able to find the <strong>VTU tile</strong>, please contact your college
          coordinator. They will verify your details and help resolve the issue.
        </p>
      ),
    },
    {
      id: 'q6',
      question: 'How can I join an event?',
      answer: (
        <>
          <p className={styles.faqAnswer}>Follow these steps to join an event:</p>
          <ul className={styles.steps}>
            <li>
              <span className={styles.stepNum}>1</span>
              <span>
                Go to <code>My Campus</code> tab → select <code>VTU</code> → open <code>Events</code>
              </span>
            </li>
            <li>
              <span className={styles.stepNum}>2</span>
              <span>Choose an event and copy the event join code</span>
            </li>
            <li>
              <span className={styles.stepNum}>3</span>
              <span>
                Enter the code via <code>Join Event</code> on the Home page, or through{' '}
                <code>Menu → Join Clubs/Event</code>
              </span>
            </li>
            <li>
              <span className={styles.stepNum}>4</span>
              <span>
                Once joined, the event will appear in your <code>My Events</code> page
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'q7',
      question: 'Where can I view my volunteering records?',
      answer: (
        <p className={styles.faqAnswer}>
          All your volunteering details are available in the <code>Volunteering Journey</code>{' '}
          section — including <strong>check-in, check-out, joined events, duration,</strong> and
          your overall activity history.
        </p>
      ),
    },
    {
      id: 'q8',
      question: 'How do I check-in and check-out for an event?',
      answer: (
        <>
          <p className={styles.faqAnswer}>
            After joining an event, go to <code>My Events</code> and select the event. Inside the
            event:
          </p>
          <ul className={styles.steps}>
            <li>
              <span className={styles.stepNum}>1</span>
              <span>
                Use the <code>Check-in</code> tile — scan the QR code to record your{' '}
                <strong>start time</strong>
              </span>
            </li>
            <li>
              <span className={styles.stepNum}>2</span>
              <span>
                Use the <code>Check-out</code> tile — scan the same QR code to record your{' '}
                <strong>end time</strong>
              </span>
            </li>
            <li>
              <span className={styles.stepNum}>3</span>
              <span>Your total volunteering hours are calculated based on this duration</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'q9',
      question: 'Is it mandatory to upload photos or videos for volunteering activities?',
      answer: (
        <>
          <div className={styles.mandatoryBadge}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Mandatory
          </div>
          <p className={styles.faqAnswer}>
            Yes, students <strong>must upload photos and/or videos</strong> with geo-tagged location
            details as proof of participation. This is required for activity validation and cannot be
            skipped.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1>Mango FAQs</h1>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`${styles.faqItem} ${openId === faq.id ? styles.open : ''}`}
            >
              <button className={styles.faqTrigger} onClick={() => toggle(faq.id)}>
                <span className={styles.qBadge}>{faq.id.toUpperCase()}</span>
                <span className={styles.faqQuestion}>{faq.question}</span>
                <svg
                  className={styles.faqIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className={styles.faqBody}>
                <div className={styles.faqBodyInner}>
                  <div className={styles.faqDivider}></div>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <strong>Need Additional Assistance?</strong>
        <br />
        Please contact your college coordinator for further support or to resolve any issues not
        covered in this FAQ.
      </footer>
    </div>
  );
};

export default FAQ;
