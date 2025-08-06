const MyWorksModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const works_data = [
    {
      title: "PRUV",
      url: "https://pruv.finance/",
      image: "/works/pruv.webp",
      description: (
        <p>
          Pruv empowers seamless and confident participation in tokenized asset
          markets for both issuers and investors. Issuers benefit from a
          streamlined process to tokenize their offerings, while investors can
          easily subscribe, hold, and redeem digital assets within a secure and
          fully compliant environment. Pruv bridges traditional finance and
          blockchain technology to make digital asset management simple,
          transparent, and accessible.
        </p>
      ),
    },
    {
      title: "D3 LABS",
      url: "https://d3labs.io",
      image: "/works/d3labs.webp",
      description: (
        <>
          <p>
            d3labs is a company website built to showcase services, expertise,
            and updates. It features a dynamic blog section for sharing
            insights, news, and technical articles—helping the company engage
            with its audience and build thought leadership in the tech space.
          </p>
        </>
      ),
    },
    {
      title: "TOKOSCHOLAR",
      url: "https://www.tokoscholar.io/",
      image: "/works/tokoscholar.webp",
      description: (
        <>
          <p>
            Tokoscholar is an educational platform designed to help users learn
            about cryptocurrency through structured courses. It offers
            beginner-friendly and advanced content aimed at making crypto
            concepts accessible and easy to understand.
          </p>
        </>
      ),
    },
    {
      title: "CITITEX",
      url: "https://cititex.com/",
      image: "/works/cititex.webp",
      description: (
        <>
          <p>
            Cititex is an e-commerce website focused on selling custom shirts
            and hoodies. Its main selling point is the ability for users to
            design their own apparel directly on the site. With an intuitive
            design tool, customers can personalize their shirts or hoodies with
            custom text, images, and colors—making each piece unique and
            meaningful.
          </p>
        </>
      ),
    },
    {
      title: "T-HUB",
      url: "",
      description: (
        <>
          <p>
            T-HUB is a modern platform that allows users to book workspaces and
            create events seamlessly. Designed for productivity and
            collaboration, it provides a user-friendly interface for managing
            bookings, organizing meetups, and connecting with others in a shared
            environment.
          </p>
        </>
      ),
    },
  ];

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
          <p className="custom-modal__modal-content__title">My Works</p>
        </div>
        <div className="custom-modal__modal-content__content">
          <ul className="works">
            {works_data.map((val) => (
              <a key={val.title} target="_blank" rel="noreferer" href={val.url}>
                <li className="works__item">
                  <div className="works__item__left">
                    <div className="works__item__left__image">
                      {val.image && <img src={val.image} />}
                    </div>
                  </div>
                  <div className="works__item__right">
                    <h2>{val.title}</h2>
                    <div>{val.description}</div>
                  </div>
                </li>
              </a>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyWorksModal;
