import { NEXT_URL } from "@/lib/utils";
import Image from "next/image";
import { Fragment } from "react";

export function AnnouncementImages({ images }: { images: string[] }) {
    return(
        <section className="w-full">
            {images.length > 5 ? (
                <section className="grid grid-cols-12">
                    {images.slice(0, 2).map((image, index) => (
                        <div className="relative col-span-6 h-50 m-[1px] overflow-hidden" key={ index }>
                            <button>      
                                <Image
                                    src={`${NEXT_URL}${image}`}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform hover:transform hover:scale-105"
                                />
                            </button>
                        </div>
                    ))}
                    {images.slice(2, 4).map((image, index) => (
                        <div className="relative col-span-4 h-40 m-[1px] overflow-hidden" key={ index }>
                            <button>
                                <Image
                                    src={`${NEXT_URL}${image}`}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform hover:transform hover:scale-105"
                                />
                            </button>
                        </div>
                    ))}
                    <div className="relative col-span-4 h-40 m-[1px] overflow-hidden">
                        <button className="w-full h-full flex justify-center items-center absolute top-0 left-0 !bg-[#0000007d] z-50">
                            <h1 className="text-4xl fw-bold text-light">{ images.length }+</h1>
                        </button>
                        <Image
                            src={`${NEXT_URL}${images[4]}`}
                            alt=""
                            fill
                            className="object-cover transition-transform hover:transform hover:scale-105"
                        />
                    </div>
                </section>
            ) : images.length === 5 ? (
                <section className="grid grid-cols-12">
                    {images.slice(0, 2).map((image, index) => (
                        <div className="relative col-span-6 h-50 m-[1px] overflow-hidden" key={ index }>
                            <button>
                                <Image
                                    src={`${NEXT_URL}${image}`}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform hover:transform hover:scale-105"
                                />
                            </button>
                        </div>
                    ))}
                    {images.slice(2, images.length).map((image, index) => (
                        <div className="relative col-span-4 h-40 m-[1px] overflow-hidden" key={ index }>
                            <button>
                                <Image
                                    src={`${NEXT_URL}${image}`}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform hover:transform hover:scale-105"
                                />
                            </button>
                        </div>
                    ))}
                </section>
            ) : images.length === 4 ? (
                <section className="grid grid-cols-12">
                    {images.map((image, index) => (
                        <div className="relative col-span-6 h-50 m-[1px] overflow-hidden" key={ index }>
                            <button>
                                <Image
                                    src={`${NEXT_URL}${image}`}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform hover:transform hover:scale-105"
                                />
                            </button>
                        </div>
                    ))}
                </section>
            ): images.length > 1 ? (
                <section className="flex">
                    {images.map((item, index) => (
                        <div className="relative flex-1 h-40 m-[1px] overflow-hidden" key={ index }>
                            <button>
                                <Image
                                    src={`${NEXT_URL}${item}`}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform hover:transform hover:scale-105"
                                />
                            </button>
                        </div>
                    ))}
                </section>
            ) : (
                <section>
                    <div className="flex">
                        <div className="relative flex-1 h-80 m-[1px] overflow-hidden">
                            <button>
                                <Image
                                    src={`${NEXT_URL}${images[0]}`}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform hover:transform hover:scale-105"
                                />
                            </button>
                        </div>
                    </div>
                </section>
            ) }

      

          

         
        </section>
    );
}