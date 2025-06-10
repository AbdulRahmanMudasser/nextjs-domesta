

'use client'

import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import gallery from "@/data/gallery";
import Image from "next/image";

const GalleryBox = () => {
  return (
    <>
      <Gallery>
        {gallery.map((singleItem) => (
          <div className="col-lg-3 col-md-3 col-sm-6" key={singleItem.id}>
            <figure className="image" role="button">
              <Item
                original={singleItem.img}
                thumbnail={singleItem.img}
                width={190}
                height={167}
              >
                {({ ref, open }) => (
                  <div className="lightbox-image" ref={ref} onClick={open}>
                    <Image
                      width={190}
                      height={167}
                      src={singleItem.img}
                      alt="resource"
                    />
                    <span className="icon flaticon-plus"></span>
                  </div>
                )}
              </Item>
            </figure>
          </div>
        ))}
      </Gallery>
    </>
  );
};

export default GalleryBox;
