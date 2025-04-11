import React from "react";

function GalleryAlbum({ album }) {
  return (
    <div className="gallery-album">
      <h3>{album.title}</h3>
      <div className="gallery-images">
        {album.images.map((img, index) => (
          <img key={index} src={img} alt={`Album ${album.title}`} />
        ))}
      </div>
    </div>
  );
}

export default GalleryAlbum;
