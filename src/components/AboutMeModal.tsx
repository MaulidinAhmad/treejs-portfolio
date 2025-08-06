import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa6";

const AboutMeModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  return (
    <div
      className={
        "custom-modal__modal-container " +
        (show ? "custom-modal__modal-container--show" : "")
      }
    >
      <div className="custom-modal__modal-overlay" onClick={onClose}></div>
      <div className="custom-modal__modal-content">
        <button
          className="custom-modal__modal-content__close"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="close"
            x="0"
            y="0"
            version="1.1"
            viewBox="0 0 512 512"
          >
            <path d="M437.5 386.6L306.9 256l130.6-130.6c14.1-14.1 14.1-36.8 0-50.9-14.1-14.1-36.8-14.1-50.9 0L256 205.1 125.4 74.5c-14.1-14.1-36.8-14.1-50.9 0-14.1 14.1-14.1 36.8 0 50.9L205.1 256 74.5 386.6c-14.1 14.1-14.1 36.8 0 50.9 14.1 14.1 36.8 14.1 50.9 0L256 306.9l130.6 130.6c14.1 14.1 36.8 14.1 50.9 0 14-14.1 14-36.9 0-50.9z"></path>
          </svg>
        </button>
        <div className="custom-modal__modal-head">
          <p className="custom-modal__modal-content__title">About Me</p>
          <div className="socials">
            <a
              href="https://www.linkedin.com/in/ahmad-maulidin-al-furqon/"
              target="_blank"
              rel="noopener"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/MaulidinAhmad?tab=repositories"
              target="_blank"
              rel="noopener"
            >
              <FaGithub />
            </a>
            <a
              href="mailto:maulidinahmadfurqon@gmail.com"
              target="_blank"
              rel="noopener"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
        <div className="custom-modal__modal-content__content about-me">
          <p>
            Hi! I’m <b>Ahmad Maulidin Al Furqon</b>, a passionate software
            developer with <b>4 years</b> of hands-on experience in building and
            maintaining web applications.
          </p>
          <br />
          <p>
            I’ve spent the last 3 years specializing in frontend development,
            crafting clean, responsive, and user-friendly interfaces using
            modern technologies like{" "}
            <b>React, Next, Gatsby, Three and TailwindCSS. </b>
            Over the past year, I’ve expanded my skillset into fullstack
            development, working with
            <b> Node.js, Express, Nest, and Postgress </b>
            to build robust and scalable backend systems.
          </p>
          <br />
          <p>
            I love turning ideas into functional, elegant solutions—and I’m
            always exploring new tools, frameworks, and best practices to
            improve my craft.
          </p>
          <br />
          <p>
            When I’m not coding, you’ll probably find me immersed in music,
            grinding through a good game, or enjoying a fresh cup of coffee
            (usually while doing the first two).
          </p>
          <br />
          <p>Let’s build something awesome together.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutMeModal;
