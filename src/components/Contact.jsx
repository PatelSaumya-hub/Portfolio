import React, { useState } from 'react';

function Contact() {
  // 1. useState for managing a form input
  const [message, setMessage] = useState('');
  
  // 2. useState for toggling UI visibility (help instructions tooltip)
  const [showHelp, setShowHelp] = useState(false);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <section id="contact" className="portfolio-section contact-view container">
      <h2>Contact &amp; Collaborations</h2>
      <p className="contact-intro">
        If you are interested in backend development, systems scalability, or smart contracts, please get in touch.
      </p>

      <div className="contact-form-container">
        
        {/* Help Toggle Visibility Trigger (useState Variable 2) */}
        <div className="help-toggle-wrapper">
          <button 
            type="button" 
            className="btn-help-toggle" 
            onClick={toggleHelp}
            aria-expanded={showHelp}
          >
            {showHelp ? 'Hide Form Guide' : 'Show Form Guide'}
          </button>
          
          {showHelp && (
            <div className="help-box">
              <p>
                <strong>Guidelines:</strong> Provide your name, project context, and preferred timeline. Please limit message size to 500 characters. 
              </p>
            </div>
          )}
        </div>

        {/* Contact Input Form */}
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              value={message}
              onChange={handleMessageChange}
              placeholder="Describe your project, timeline, or engineering inquiry..."
              rows={5}
              maxLength={500}
              className="controlled-textarea"
            />
            {/* Live Character Count */}
            <div className="character-count">
              <span>{message.length} / 500 characters</span>
            </div>
          </div>
        </form>

        {/* Real-time Controlled Input Display */}
        <div className="input-preview-box">
          <h4>Real-time Message Preview</h4>
          <div className="preview-content">
            {message ? message : <span className="placeholder-text">Type in the input box above to see your message in real-time...</span>}
          </div>
        </div>
      </div>

      <div className="direct-contact-methods">
        <h3>Direct Channels</h3>
        <ul className="contact-list">
          <li>Email: <a href="mailto:sp.1709.dev@gmail.com">sp.1709.dev@gmail.com</a></li>
          <li>GitHub: <a href="https://github.com/PatelSaumya-hub" target="_blank" rel="noopener noreferrer">github.com/PatelSaumya-hub</a></li>
          <li>LinkedIn: <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">linkedin.com</a></li>
        </ul>
      </div>
    </section>
  );
}

export default Contact;
