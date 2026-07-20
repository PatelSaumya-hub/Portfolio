import React from 'react';

function Skills({ skillList }) {
  return (
    <section id="skills" className="portfolio-section">
      <h2>Technical Skills</h2>
      <ul className="skills-list">
        {skillList.map((skill) => (
          <li key={skill} className="skills-item">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
