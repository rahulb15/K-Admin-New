import React, { useState, useEffect } from "react";
import { Card, Grid, Box, styled, useTheme, Button } from "@mui/material";
import { Span } from "app/components/Typography";
import Breadcrumb from "app/components/Breadcrumb";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// STYLED COMPONENT
const Container = styled("div")(({ theme }) => ({
  margin: 30,
  [theme.breakpoints.down("sm")]: { margin: 16 },
  "& .breadcrumb": {
    marginBottom: 30,
    [theme.breakpoints.down("sm")]: { marginBottom: 16 },
  },
}));

const SliderOptions = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    infinite: true,
    speed: 1000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    swipeToSlide: true,

    // responsive: [
    //     {
    //         breakpoint: 992,
    //         settings: {
    //             arrows: false,
    //         },
    //     },
    // ],
};

const data = {
    banners: [
        {
            id: 1,
            title: "Get Started With React",
            description:
                "React is a popular JavaScript library for building user interfaces.",
            image: {
                src: "/assets/images/products/headphone-1.jpg",
            },
            buttons: [
                {
                    id: 1,
                    content: "Get Started",
                    variant: "contained",
                    color: "primary",
                    size: "large",
                    href: "#",
                },
                {
                    id: 2,
                    content: "Learn More",
                    variant: "outlined",
                    color: "primary",
                    size: "large",
                    href: "#",
                },
            ],
        },
        {
            id: 2,
            title: "Get Started With React",
            description:
                "React is a popular JavaScript library for building user interfaces.",
            image: {
                src: "/assets/images/products/headphone-2.jpg",
            },
            buttons: [
                {
                    id: 1,
                    content: "Get Started",
                    variant: "contained",
                    color: "primary",
                    size: "large",
                    href: "#",
                },
                {
                    id: 2,
                    content: "Learn More",
                    variant: "outlined",
                    color: "primary",
                    size: "large",
                    href: "#",
                },
            ],
        }
    ],
};




const Layout = () => {
  const theme = useTheme();
  const [images, setImages] = useState([]);
  const [count, setCount] = useState(0);

  const handleImageChange = (e) => {
    const files = e.target.files;
    let images = [];
    for (let i = 0; i < files.length; i++) {
      images.push(URL.createObjectURL(files[i]));
    }
    setImages(images);
  };

  const handleAddMore = () => {
    setCount(count + 1);
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Config", path: "/config" },
            { name: "Payment Gateway" },
          ]}
        />
      </Box>

      {/* <Card> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Span fontSize="18px" fontWeight="700">
            Hero Section Images
          </Span>
        </Grid>

        {/* multiple images upload  by add more button option */}
        <Grid item xs={12}>
          <input type="file" onChange={handleImageChange} multiple />
          <Button onClick={handleAddMore}>Add More</Button>
          <Grid container spacing={3}>
            {/* {images.map((image, index) => (
                <Grid item xs={3} key={index}>
                  <img src={image} alt="" style={{ width: "100%" }} />
                </Grid>
              ))}

              {[...Array(count)].map((_, index) => (
                <Grid item xs={3} key={index}>
                  <input type="file" onChange={handleImageChange} />
                </Grid>
              ))} */}

            <Grid item xs={12}>
              {/* <Slider {...settings}>
                {images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt="" style={{ width: "100%" }} />
                  </div>
                ))}
              </Slider> */}

{data?.banners && (
                <Slider
                    options={SliderOptions}
                    className="slider-style-6 wide-wrapper slick-activation-06 slick-arrow-between"
                >
                    {data.banners.map(
                        (banner) => (
                            console.log(banner.image.src),
                            (
                                <div key={banner.id}>
                                    <Box
                                        component="div"
                                        sx={{
                                            backgroundImage: `url(${banner.image.src})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            height: "100vh",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: "column",
                                            color: theme.palette.common.white,
                                            textAlign: "center",
                                        }}
                                    >
                                        <Span
                                            fontSize="36px"
                                            fontWeight="700"
                                            lineHeight="1.2"
                                            mb={3}
                                        >
                                            {banner.title}
                                        </Span>
                                        <Span
                                            fontSize="18px"
                                            lineHeight="1.5"
                                            mb={3}
                                        >
                                            {banner.description}
                                        </Span>
                                        <Box>
                                            {banner.buttons.map(
                                                (button) => (
                                                    <Button
                                                        key={button.id}
                                                        variant={button.variant}
                                                        color={button.color}
                                                        size={button.size}
                                                        href={button.href}
                                                    >
                                                        {button.content}
                                                    </Button>
                                                )
                                            )}
                                        </Box>
                                    </Box>
                                </div>
                            )
                        )
                    )}
                </Slider>
            )}

          


              



            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* </Card> */}
    </Container>
  );
};
export default Layout;
