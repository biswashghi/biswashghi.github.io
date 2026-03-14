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
                    Highly skilled engineer with work experience ranging from API design and development,
                    microservice frameworks, batch and real-time data processing, and modern event processing frameworks.
                </p>
            </section>

            <section className="resume-block">
                <h3 className="resume-h">Experience</h3>
                <div className="resume-item">
                    <div className="resume-item__top">
                        <h4 className="resume-item__title">Capital One / Lead Software Engineer</h4>
                        <p className="resume-item__meta">Aug 2020 - Present, Remote</p>
                    </div>
                    <ul className="resume-list">
                        <li>
                            Worked in a core team to design a fault-tolerant, microservices-based event processing framework utilizing
                            Kafka clusters, SQS, Lambdas, and DynamoDB to modernize the Capital One Loyalty EarnEngine. The process handles
                            60 million+ events each day and reduces award latency by 8 hours and total runtime by 3 hours.
                        </li>
                        <li>
                            Led a tech team of 5 engineers in implementing aspects of this design and supported a year-long migration of all
                            Capital One credit card customers to this modernized engine.
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
                        <p className="resume-k">Cloud</p>
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
