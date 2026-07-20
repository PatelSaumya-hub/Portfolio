# Developer Portfolio

Systems, Backend, and Web3 Software Engineer specializing in scalable API design, smart contract development, data pipelines, and NLP processing. Focused on implementing clean system architectures and robust logic controllers.

---

## Technical Skills Matrix

| Domain | Technologies |
| :--- | :--- |
| **Languages** | Python, JavaScript, TypeScript, Solidity, SQL, C++ |
| **APIs & Backend** | FastAPI, Express.js, Node.js, RESTful API design, Uvicorn (ASGI) |
| **Databases & ORMs** | SQLite, PostgreSQL, SQLAlchemy ORM, relational schema design |
| **Web3 & Blockchain** | Solidity, Foundry Framework, OpenZeppelin v5, ERC-20, ERC-721 Standards |
| **Data & NLP** | Pandas, NumPy, Matplotlib, Seaborn, Dice Similarity Coefficients, pdfminer |
| **DevOps & Tools** | Git, GitHub Actions, Docker, Package Managers (npm, pip), virtualenv |

---

## Selected Engineering Highlights

### ShopDot - Internship Project
*B2B Drop-shipping Validation and Order Routing Engine*
* **Core Technologies**: FastAPI, Python, SQLAlchemy, SQLite, Pydantic, Hashing (bcrypt)
* **Description**: Engineered a B2B drop-shipping order validation framework during a backend engineering internship. The system validates stock levels across a multi-brand catalog, calculates total pricing, decrements inventories in database transactions, and automatically dispatches routed orders to suppliers.
* **Key Implementations**:
  * Designed modular routing groups (authentication, product management, order processing, and analytics metrics).
  * Implemented transaction-safe database sessions with SQLAlchemy ORM using SQLite.
  * Utilized Pydantic schemas for data validation on order request payloads.
  * Formulated automatic database seeding scripts to populate default brand and supplier accounts.

### FleetFlow - Odoo Hackathon Project
*Enterprise Logistics and Fleet Tracking Core*
* **Core Technologies**: React (Vite), Express.js, Node.js, SQLite3, Zustand state management, TailwindCSS
* **Description**: Developed as a project for the Odoo Hackathon, FleetFlow is a full-stack logistics tracking dashboard. It separates user flows between driver logs (fuel entries, expenses, maintenance tickets) and administrative operations (trip assignments, approval matrices, budget allocations).
* **Key Implementations**:
  * Programmed multi-tier Express authorization middleware to isolate driver capabilities from manager approvals.
  * Designed complex SQLite relational database tables tracking drivers, vehicles, and logs.
  * Set up asynchronous status changes allowing managers to approve or reject driver expense entries.
  * Managed global application state using Zustand for real-time frontend responsiveness.

---

## Featured Projects

### Paper Trail
*Locally-Hosted Academic Research Assistant and NLP Similarity Engine*
* **Core Technologies**: FastAPI, Python, pdfminer, SQLAlchemy, SQLite, JWT, ArXiv API
* **Description**: A local research indexing assistant that processes PDF documents, parses content, and recommends matching papers from the local database or via remote ArXiv API concurrent queries.
* **Key Implementations**:
  * Optimized pdfminer scripts to extract text blocks from academic PDF files.
  * Built a custom NLP word frequency tokenization pipeline, stripping common stop words.
  * Programmed a local similarity calculation based on Dice's Coefficient vectors.
  * Structured multi-threaded API requests using Python's concurrent.futures to query the arXiv database.
  * Secured endpoints using JWT authentication and bcrypt password hashing.

#### System Flow
```
[ PDF File Input ] ---> [ pdfminer Parser ] ---> [ Stopword filter ]
                                                          |
                                                          v
[ Output Rank Map ] <--- [ Similarity Engine ] <--- [ Word Frequency Hash ]
```

### ChainBeasts & PowerToken
*GameFi NFT Evolutionary Protocol and ERC20 Ecosystem*
* **Core Technologies**: Solidity, Foundry, OpenZeppelin v5, ERC-721, ERC-20
* **Description**: EVM Smart Contracts establishing a GameFi NFT evolution cycle powered by a custom ERC20 utility token payment system. Users spend $POWER tokens to mint beasts and burn tokens to evolve their beasts to higher stages.
* **Key Implementations**:
  * Programmed the ChainBeasts ERC721 evolutionary contract managing stage tracking.
  * Developed the PowerToken ERC20 contract featuring native airdrop-distribution loops.
  * Implemented secure custom Solidity error codes to reduce overall gas consumption.
  * Set up verification testing matrices using the Foundry Framework.

#### System Flow
```
[ User Wallet ] --------> [ PowerToken Contract ] ----> [ Evolution Burn ]
       |                                                      |
       v                                                      v
[ Approve Power Spend ] -> [ ChainBeasts Contract ] --> [ Evolution Event ]
```

### Walmart Sales Analytics
*Exploratory Data Analysis and Seasonality Sales Modeler*
* **Core Technologies**: Python, Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebook
* **Description**: A data science project focusing on cleaning, organizing, and analyzing Walmart retail sales metrics to determine correlations with macroeconomic indicators (CPI, fuel prices, unemployment).
* **Key Implementations**:
  * Implemented statistical data cleaning to filter outliers and standard errors.
  * Formulated multivariate correlation matrices comparing sales numbers to financial indices.
  * Developed seasonal adjustment models showing performance spikes around major holidays.
  * Visualized store revenue deviations and economic trends using Seaborn.

---

## Technical Experience

* **Odoo Hackathon Developer**: Implemented backend routers and role-based logic structures.
* **Backend Engineering Intern**: Developed B2B drop-shipping catalog APIs and transaction flows.
* **Web3 & Blockchain Workshop Participant**: Designed and tested evolutionary smart contract architectures.

---

## Contact and Professional Links

* **Email**: [sp.1709.dev@gmail.com](mailto:sp.1709.dev@gmail.com)
* **GitHub**: [github.com/PatelSaumya-hub](https://github.com/PatelSaumya-hub)
* **LinkedIn**: [linkedin.com](https://linkedin.com)
