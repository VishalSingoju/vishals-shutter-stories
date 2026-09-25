const GALLERIES = {
  portraits: [
    { src: "assets/images/portraits/portrait-01.webp", alt: "Portrait in natural light", caption: "Portrait · Natural light" },
    { src: "assets/images/portraits/portrait-02.webp", alt: "Candid portrait", caption: "Portrait · Candid" },
    { src: "assets/images/portraits/portrait-03.webp", alt: "Editorial portrait", caption: "Portrait · Editorial" },
    { src: "assets/images/portraits/portrait-04.webp", alt: "Black and white portrait", caption: "Portrait · Black & white" },
    { src: "assets/images/portraits/portrait-05.webp", alt: "Outdoor portrait", caption: "Portrait · Outdoor" },
    { src: "assets/images/portraits/portrait-06.webp", alt: "Environmental portrait", caption: "Portrait · Environmental" }
  ],
  weddings: [
    { src: "assets/images/weddings/wedding-01.webp", alt: "Candid wedding moment", caption: "Wedding · Candid" },
    { src: "assets/images/weddings/wedding-02.webp", alt: "Wedding ceremony moment", caption: "Wedding · Ceremony" },
    { src: "assets/images/weddings/wedding-03.webp", alt: "Wedding couple portrait", caption: "Wedding · Couple" },
    { src: "assets/images/weddings/wedding-04.webp", alt: "Wedding family moment", caption: "Wedding · Family" },
    { src: "assets/images/weddings/wedding-05.webp", alt: "Wedding cultural detail", caption: "Wedding · Detail" },
    { src: "assets/images/weddings/wedding-06.webp", alt: "Wedding celebration", caption: "Wedding · Celebration" }
  ],
  wildlife: [
    { src: "https://res.cloudinary.com/dqzlgkrrq/image/upload/2K2A4151_polarr_pbzu7v.jpg", alt: "Bird photographed in the wild", caption: "Indian Spotted Owlet" },
    { src: "assets/images/wildlife/wildlife-02.webp", alt: "Bird in natural habitat", caption: "Wildlife · Habitat" },
    { src: "assets/images/wildlife/wildlife-03.webp", alt: "Wildlife detail", caption: "Wildlife · Detail" },
    { src: "assets/images/wildlife/wildlife-04.webp", alt: "Bird portrait", caption: "Wildlife · Portrait" },
    { src: "assets/images/wildlife/wildlife-05.webp", alt: "Bird in flight", caption: "Wildlife · Motion" },
    { src: "assets/images/wildlife/wildlife-06.webp", alt: "Wildlife observed in nature", caption: "Wildlife · Observation" }
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
