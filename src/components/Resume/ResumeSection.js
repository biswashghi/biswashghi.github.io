import React from 'react';

const ResumeSection = () => {
    return (
        <div className="resume-section">
            <header className="resume-head">
                <h2 className="resume-name">Biswash Ghimire</h2>
                <p className="resume-contact">
                    <a className="resume-link" href="tel:+15178991751">(517) 899-1751</a>
                    <span className="resume-dot" aria-hidden="true">•</span>
                    <a className="resume-link" href="mailto:ghi.biswash@gmail.com">ghi.biswash@gmail.com</a>
                    <span className="resume-dot" aria-hidden="true">•</span>
                    <a className="resume-link" href="https://www.linkedin.com/in/ghimire-biswash" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a>
                </p>
            </header>

            <section className="resume-block">
                <h3 className="resume-h">Personal Summary</h3>
                <p className="resume-p">
                    Lead Software Engineer with 5+ years designing distributed backend systems, event-driven platforms,
                    and reusable cloud-native services for large-scale financial applications. Technical lead experienced
                    in cross-team architecture, platform modernization, and partner integrations.
                </p>
            </section>

            <section className="resume-block">
                <h3 className="resume-h">Experience</h3>
                <div className="resume-item">
                    <div className="resume-item__top">
                        <h4 className="resume-item__title">Capital One / Lead Software Engineer</h4>
                        <p className="resume-item__meta">Aug 2020 - Present, Remote</p>
                    </div>
                    <p className="resume-k">Loyalty Earn Platform &amp; Distributed Systems</p>
                    <ul className="resume-list">
                        <li>
                            Technical lead within a 30-40 engineer, six-team modernization effort building Capital One&apos;s
                            next-generation Loyalty Earn Platform.
                        </li>
                        <li>
                            Architected event-driven processing supporting 60M+ daily events, reducing rewards latency by
                            8 hours and processing runtime by 3 hours.
                        </li>
                        <li>
                            Designed multi-region event-processing architectures incorporating layered idempotency,
                            event ordering, and consistency strategies to ensure reliable reward processing across
                            distributed streaming systems.
                        </li>
                        <li>
                            Redesigned reward processing architecture to support ordered benefit evaluation and
                            threshold-based state transitions within an event-driven platform to support Discover
                            integration, overcoming assumptions of benefit independence.
                        </li>
                    </ul>

                    <p className="resume-k">Partner Integrations &amp; Platform Engineering</p>
                    <ul className="resume-list">
                        <li>
                            Designed the convergence strategy from legacy orchestration APIs to a unified Loyalty
                            Platform service supporting Amazon, PayPal, REI, T-Mobile, and future partners.
                        </li>
                        <li>
                            Consolidated 10 partner API endpoints into a common integration platform processing 30M+
                            daily API requests, using reusable abstractions to simplify onboarding of new partners.
                        </li>
                        <li>
                            Balanced repository architecture and deployment tradeoffs by converging partner
                            implementations into a shared codebase with strict automated regression guarantees,
                            enabling independent feature development while maintaining partner-specific behavior.
                        </li>
                        <li>
                            Modernized AutoRedemption through reusable event-driven integration patterns that became
                            the architectural foundation for Discover AutoRedemption.
                        </li>
                        <li>
                            Generalized bureau data pipelines supporting Equifax, Experian, and TransUnion, enabling
                            reusable partner onboarding with 100% migration validation.
                        </li>
                    </ul>

                    <p className="resume-k">Platform Modernization &amp; Technical Leadership</p>
                    <ul className="resume-list">
                        <li>
                            Technical lead for a team of five engineers, partnering with engineering leadership and
                            product to define technical direction, architecture, and implementation plans.
                        </li>
                        <li>
                            Served as a Loyalty platform SME, collaborating with peer tech leads and Distinguished
                            Engineers on event schemas, integration contracts, and cross-team architecture.
                        </li>
                        <li>
                            Regularly collaborated with engineering managers, product owners, and peer technical
                            leads to decompose large architectural initiatives into implementation roadmaps spanning
                            multiple engineering teams.
                        </li>
                    </ul>
                </div>

                <div className="resume-item">
                    <div className="resume-item__top">
                        <h4 className="resume-item__title">University of Michigan EECS Department / Instructional Aide</h4>
                        <p className="resume-item__meta">Jan 2019 - Apr 2020</p>
                    </div>
                    <ul className="resume-list">
                        <li>
                            Led lab sessions, held office hours, and supported student understanding of web technologies such as REST APIs,
                            CSR/SSR, DNS, and cloud computing.
                        </li>
                        <li>
                            Collaborated with faculty to design, administer, and grade exams and assignments; provided detailed feedback to
                            students and contributed to continuous course improvement through content development and updates.
                        </li>
                    </ul>
                </div>

                <div className="resume-item">
                    <div className="resume-item__top">
                        <h4 className="resume-item__title">Scientific Computing and Flow Physics Laboratory / Research Assistant</h4>
                        <p className="resume-item__meta">Sep 2016 - Apr 2017</p>
                    </div>
                    <ul className="resume-list">
                        <li>
                            Worked under a PhD candidate to explore benefits of high-order vs low-order discretization in space and time when
                            utilizing numerical methods such as Runge-Kutta (RK), Discontinuous-Galerkin (DG), and Finite Difference (FD) for
                            unsteady physical system simulation using GMSH.
                        </li>
                        <li>
                            Presented learnings in a poster presentation session at the end of the year organized by the Undergraduate Research
                            Opportunities Program.
                        </li>
                    </ul>
                </div>
            </section>

            <section className="resume-block">
                <h3 className="resume-h">Skills</h3>
                <div className="resume-split">
                    <div className="resume-chipset">
                        <p className="resume-k">Languages</p>
                        <p className="resume-v">Go, Python, Java, C, C++</p>
                    </div>
                    <div className="resume-chipset">
                        <p className="resume-k">Frameworks & Tools</p>
                        <p className="resume-v">Spring, Docker, Spark, Hadoop</p>
                    </div>
                    <div className="resume-chipset">
                        <p className="resume-k">Databases</p>
                        <p className="resume-v">PostgreSQL, Cassandra, MongoDB, DocumentDB, DynamoDB</p>
                    </div>
                    <div className="resume-chipset">
                        <p className="resume-k">Cloud Platforms / Services</p>
                        <p className="resume-v">AWS (Lambda, EC2, EMR, Fargate, SQS, SNS, Kinesis, and more)</p>
                    </div>
                </div>
            </section>

            <section className="resume-block">
                <h3 className="resume-h">Education</h3>
                <div className="resume-item">
                    <div className="resume-item__top">
                        <h4 className="resume-item__title">University of Michigan / Computer Science, B.S.</h4>
                        <p className="resume-item__meta">Aug 2016 - May 2020, Ann Arbor, MI</p>
                    </div>
                    <ul className="resume-list">
                        <li>
                            Thread Manager: Developed a multi-threaded library for Unix operating systems in C++, supporting threading primitives,
                            mutexes, and more.
                        </li>
                        <li>
                            Key/Value Store: Implemented a Go-based key-value service supporting concurrent datastore requests via primary/backup
                            replication and a Paxos-based replicated state machine.
                        </li>
                    </ul>
                </div>
            </section>

            <section className="resume-block">
                <h3 className="resume-h">Certifications</h3>
                <div className="resume-item">
                    <div className="resume-item__top">
                        <h4 className="resume-item__title">AWS Solutions Architect</h4>
                        <p className="resume-item__meta">May 2021 - Present</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ResumeSection;
