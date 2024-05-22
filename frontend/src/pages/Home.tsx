import { Link } from "react-router-dom";
import { Folder } from "lucide-react";
import { WandSparkles } from "lucide-react";
import { useAppContext } from "../hooks/use-app-context";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import React, { useEffect, useMemo, useState } from "react";
import { Container, IOptions, RecursivePartial } from "@tsparticles/engine";
import { Img, resource } from "react-suspense-img";
import { Skeleton } from "@mui/material";
const Home = () => {
  const { isLoggedIn } = useAppContext();
  const [init, setInit] = useState(false);
  const [height, setHeight] = useState("");
  const [showPreloader, setShowPreloader] = useState(true);
  const [showControlsWithoutCaptions, setShowControlsWithoutCaptions] =
    useState(false);
  const [showControlsWithCaptions, setShowControlsWithCaptions] =
    useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setHeight("400px");
    } else if (window.innerWidth < 768) {
      setHeight("500px");
    } else if (window.innerWidth < 1024) {
      setHeight("600px");
    } else {
      setHeight("700px");
    }
  }, []);

  const particlesLoaded = async (container: Container | undefined) => {};
  const options = useMemo(
    () => ({
      fpsLimit: 120,
      particles: {
        color: {
          value: "#adc6c6",
        },
        links: {
          color: "#adc6c6",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 120,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "triangle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    []
  );
  resource.preloadImage(
    `${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/demo-original.png`
  );
  resource.preloadImage(
    `${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/demo-captions.png`
  );

  return (
    <>
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options as RecursivePartial<IOptions>}
        />
      )}
      <div className="text-white  min-h-screen h-full relative w-full flex-1 flex flex-col ">
        <div
          className="absolute min-w-screen -left-52 -top-[300px]"
          id="home-svg"
        >
          <img
            src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/svg-bg-main.png`}
            alt="background svg"
          />
        </div>
        <div
          className="absolute min-w-[1000px] -bottom-36 -right-44"
          id="home-svg"
        >
          <img
            src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/svg-bg-horizontal.png`}
            alt="background svg"
          />
        </div>
        <h1 className="mt-8 font-bold max-w-4xl mx-auto  w-full text-center md:text-7xl sm:text-6xl text-4xl z-10 px-4">
          Enhance{" "}
          <span className="bg-gradient-to-r from-white to-primaryDarker text-transparent bg-clip-text">
            your video with captions in seconds
          </span>
        </h1>
        <h4 className="text-center md:mt-6 mt-4 md:text-2xl sm:text-xl text-lg">
          Get started by uploading your files below.
        </h4>
        <div className="relative  w-full h-full">
          <div className="relative mt-6 sm:px-4 max-w-5xl mx-auto w-full h-full ">
            <div className="w-full " id="video-corners">
              <img
                src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/frame-top.png`}
                className=""
                alt="background frame"
              />
            </div>
            <div className="sm:px-4 px-1 h-full flex max-md:flex-col  sm:-mt-6 sm:-mb-10 ">
              <div className="flex w-full ">
                <div className="h-full relative group/nocaps rounded-md md:w-[35%]  w-[45%] shadow overflow-hidden">
                  <div className={showPreloader ? "flex" : "hidden"}>
                    <Skeleton
                      variant="rectangular"
                      height={height}
                      width="100%"
                      sx={{
                        borderRadius: "8px",
                        bgcolor: "#116466",
                        width: "100%",
                        height: "100%",
                      }}
                      animation="pulse"
                    />
                  </div>
                  <div className={!showPreloader ? "flex" : "hidden"}>
                    <React.Suspense
                      fallback={
                        <div className="rounded-md h-full w-full">
                          <Skeleton
                            variant="rectangular"
                            height={height}
                            sx={{
                              borderRadius: "8px",
                              bgcolor: "##116466",
                              width: "100%",
                              display: "flex",
                            }}
                            animation="pulse"
                          />
                        </div>
                      }
                    >
                    <Img
                      src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/demo-original.png`}
                      alt="demo video original"
                      className="rounded-md h-full w-full group-hover/nocaps:hidden object-cover  absolute"
                      onLoad={() => setShowPreloader(false)}
                    />
                    <video
                      playsInline
                      preload="auto"
                      muted
                      loop
                      controls={showControlsWithoutCaptions}
                      onMouseOver={(event) => {
                        (event.target as HTMLVideoElement).play();
                        setShowControlsWithoutCaptions(true);
                      }}
                      onMouseOut={(event) => {
                        (event.target as HTMLVideoElement).pause();
                        setShowControlsWithoutCaptions(false);
                      }}
                      src={`${process.env.REACT_APP_CLOUDINARY_VIDEO_ASSETS_URL}/demo-original.mp4`}
                      className="rounded-md w-full h-full  object-cover hover:shadow-primary/90 hover:shadow-2xl"
                    ></video>
                    </React.Suspense>
                  </div>
                </div>
                <div className="flex-1 px-4 items-center justify-center flex -mt-20">
                  <div className=" w-full   flex flex-col items-center gap-10">
                    <WandSparkles className=" text-white/50 font-semibold sm:w-16 sm:h-16 h-7 w-7  md:h-20 md:w-20" />
                    <Link
                      to={`${isLoggedIn ? "/projects" : "/sign-in"}`}
                      className="max-md:hidden bg-primary text-white shadow-primary/90 tracking-wider font-semibold flex  w-full items-center px-2   lg:py-5 py-4 justify-center rounded-lg shadow-2xl hover:bg-primary/80 laptop:text-lg"
                    >
                      <Folder className="mr-2 w-6 h-6" />
                      <span>Upload your files</span>
                    </Link>
                  </div>
                </div>
                <div className="h-full relative group/caps rounded-md  md:w-[35%]  w-[45%] shadow overflow-hidden">
                
                  <div className={showPreloader ? "flex" : "hidden"}>
                    <Skeleton
                      variant="rectangular"
                      height={height}
                      width="100%"
                      sx={{
                        borderRadius: "8px",
                        bgcolor: "#116466",
                        width: "100%",
                        height: "100%",
                      }}
                      animation="pulse"
                    />
                  </div>
                  <div className={!showPreloader ? "flex" : "hidden"}>
                    <React.Suspense
                      fallback={
                        <div className="rounded-md h-full w-full">
                          <Skeleton
                            variant="rectangular"
                            height={height}
                            sx={{
                              borderRadius: "8px",
                              bgcolor: "##116466",
                              width: "100%",
                              display: "flex",
                            }}
                            animation="pulse"
                          />
                        </div>
                      }
                    >
                    <Img
                      src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/demo-captions.png`}
                      alt="demo video with captions"
                      className="rounded-md h-full w-full group-hover/caps:hidden object-cover absolute"
                      onLoad={() => setShowPreloader(false)}
                    />
                    <video
                      preload="auto"
                      playsInline
                      muted
                      loop
                      controls={showControlsWithCaptions}
                      onMouseOver={(event) => {
                        (event.target as HTMLVideoElement).play();
                        setShowControlsWithCaptions(true);
                      }}
                      onMouseOut={(event) => {
                        (event.target as HTMLVideoElement).pause();
                        setShowControlsWithCaptions(false);
                      }}
                      src={`${process.env.REACT_APP_CLOUDINARY_VIDEO_ASSETS_URL}/demo-captions.mp4`}
                      className="rounded-md w-full h-full  object-cover hover:shadow-primary/90 hover:shadow-2xl"
                    ></video>
                    </React.Suspense>
                  </div>
                </div>
              </div>
              <Link
                to={`${isLoggedIn ? "/projects" : "/sign-in"}`}
                className="md:hidden bg-primary text-white shadow-primary/90 tracking-wider font-semibold flex  w-full items-center laptop:px-8  lg:py-5 py-4 justify-center rounded-lg shadow-2xl hover:bg-primary/80 my-5 text-lg"
              >
                <Folder className=" mr-2 w-6 h-6" />
                <span>Upload your files</span>
              </Link>
            </div>
            <div className="w-full " id="video-corners">
              <img
                src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/frame-bottom.png`}
                className=""
                alt="background frame"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
