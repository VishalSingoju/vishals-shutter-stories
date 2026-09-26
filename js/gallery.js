const GALLERIES = {
  portraits: [
    { src: "assets/images/portraits/portrait-01.webp", alt: "Portrait in natural light", caption: "Portrait · Natural light" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790432771/IMG_9371_mrgt0b.jpg", alt: "Candid portrait", caption: "Portrait · Candid" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790432418/4_akpr0j.jpg", alt: "Editorial portrait", caption: "Portrait · Editorial" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790432851/IMG_0127_pgg6ea.jpg", alt: "Black and white portrait", caption: "Portrait · Black & white" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790432866/IMG_9336_jjybkj.jpg", alt: "Outdoor portrait", caption: "Portrait · Outdoor" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790432833/IMG_4384_pz7dxa.jpg", alt: "Environmental portrait", caption: "Portrait · Environmental" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790432822/IMG_0122_biob5r.jpg", alt: "Studio portrait", caption: "Portrait · Studio" }
  ],
  weddings: [
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790431373/WhatsApp_Image_2024-11-23_at_23.13.44_d426145d_lhpqg7.jpg", alt: "Candid wedding moment", caption: "Wedding · Candid" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790431374/WhatsApp_Image_2024-11-23_at_23.12.34_6628f033_s9btot.jpg", alt: "Wedding ceremony moment", caption: "Wedding · Ceremony" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790431407/DSC05965_pridd3.jpg", alt: "Wedding couple portrait", caption: "Wedding · Couple" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790434288/compressed_1790434087870_sxkxva.jpg", alt: "Wedding family moment", caption: "Wedding · Family" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790434270/compressed_1790434216129_jscbgn.jpg", alt: "Wedding cultural detail", caption: "Wedding · Detail" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790434267/compressed_1790434149713_o6kkdn.jpg", alt: "Wedding celebration", caption: "Wedding · Celebration" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790434268/compressed_1790434182509_umrquy.jpg", alt: "Wedding candid moment", caption: "Wedding · Candid" }
  ],
  wildlife: [
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/2K2A4151_polarr_pbzu7v.jpg", alt: "Bird photographed in the wild", caption: "Indian Spotted Owlet" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790434532/20220205_235742_655_efi5dk.jpg", alt: "Bird in natural habitat", caption: "Wildlife · Habitat" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790434535/IMG_9280_jk07jm.jpg", alt: "Wildlife detail", caption: "Wildlife · Detail" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790434534/20220508163902_2K2A8161_bxqjht.jpg", alt: "Bird portrait", caption: "Wildlife · Portrait" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790434524/20220916105241_2K2A6080-01_dvwbtr.jpg", alt: "Bird in flight", caption: "Wildlife · Motion" },
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/v1790434523/20220508170648_2K2A8214-01_fqxd7u.jpg", alt: "Wildlife observed in nature", caption: "Wildlife · Observation" }
  ],
  moto: [
    { src: "assets/images/moto/moto-01.webp", alt: "Motorcycle in motion", caption: "Moto · Motion" },
    { src: "assets/images/moto/moto-02.webp", alt: "Motorcycle detail", caption: "Moto · Detail" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const key = gallery.dataset.gallery;
  const items = GALLERIES[key] || [];
  const count = document.querySelector("[data-gallery-count]");

  if (count) count.textContent = `${items.length} frames`;

  items.forEach((item, index) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-trigger";
    button.setAttribute("aria-label", `Open ${item.caption}`);

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;
    img.width = 1200;
    img.height = 1500;
    img.loading = "lazy";
    img.decoding = "async";

    const caption = document.createElement("figcaption");
    caption.textContent = item.caption;

    button.appendChild(img);
    figure.appendChild(button);
    figure.appendChild(caption);
    gallery.appendChild(figure);

    button.addEventListener("click", () => {
      if (typeof window.openLightbox === "function") {
        window.openLightbox(index, items);
      }
    });
  });
});
