import React from 'react';

function Projects() {
  return (
    <section id="projects" className="portfolio-section projects-view container">
      <h2>Featured Projects</h2>
      
      <div className="projects-list">
        
        <div className="project-node">
          <h3>Paper Trail</h3>
          <p className="project-type">NLP Similarity Engine &amp; Academic Assistant</p>
          <p className="project-desc">
            A locally-hosted academic research assistant processing PDF files, building keyword dictionary frequency hashes, and calculating Dice similarity coefficients to recommend papers from database caches or ArXiv search interfaces.
          </p>
          <pre className="project-flow">
{`[ PDF File Input ] ---> [ pdfminer Parser ] ---> [ Stopword filter ]
                                                          |
                                                          v
[ Output Rank Map ] <--- [ Similarity Engine ] <--- [ Word Frequency Hash ]`}
          </pre>
        </div>

        <div className="project-node">
          <h3>ChainBeasts &amp; PowerToken</h3>
          <p className="project-type">GameFi NFT Evolution Protocol</p>
          <p className="project-desc">
            EVM smart contracts designed in Solidity using Foundry. Establishes ERC721 token evolution milestones linked with transactional ERC20 token burn processes. Custom error designs limit overall gas consumption.
          </p>
          <pre className="project-flow">
{`[ User Wallet ] --------> [ PowerToken Contract ] ----> [ Evolution Burn ]
       |                                                      |
       v                                                      v
[ Approve Power Spend ] -> [ ChainBeasts Contract ] --> [ Evolution Event ]`}
          </pre>
        </div>

        <div className="project-node">
          <h3>Walmart Sales Analytics</h3>
          <p className="project-type">Jupyter Data Science EDA</p>
          <p className="project-desc">
            Exploratory data analysis modeling store efficiency levels, charting seasonality performance spikes around major holidays, and visualizing economic correlation coefficients (CPI, fuel, unemployment) using Pandas and Seaborn.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Projects;
