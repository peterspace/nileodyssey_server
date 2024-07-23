const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { errorHandler } = require("./middleware/errorMiddleware.js");
const User = require("./models/User.js");
const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(cors());
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      process.env.FRONTEND_URL,
      process.env.BACKEND_URL,
      "*",
    ],
    credentials: true,
  })
);

// -momery unleaked---------
app.set("trust proxy", 1);

const backend = process.env.BACKEND_URL;
const app_id = process.env.FACEBOOK_APP_ID;
const app_access_token = process.env.FACEBOOK_ACCESS_TOKEN;
const keitaroFirstCampaign = process.env.KEITAROFIRSTCAMPAIGN;
const activeGame = process.env.ACTIVEGAMELINK;
const googleLink = process.env.GOOGLELINK;
const defaultRequestURL = process.env.DEFAULT_REQUEST_URL;

//Step1: initial path

//========{before app install}====================
// adding params: `http://localhost:4000?sub_id_1=NPR`
//========{after app install}====================
// adding params: `http://localhost:4000?advertiser_tracking_id=123`

//second campaign options: "https://wingsofflimitsprivacy.xyz/WngsffLmtsBwfdxs?fbclid={fbclid}&utm_campaign={{campaign.name}}&utm_source={{site_source_name}}&sub_id_1={sub1}&sub_id_2={sub2}&sub_id_3={sub3}&sub_id_4={sub4}&sub_id_5={sub5}&sub_id_6={sub6}&fbclid={fbclid}&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app&purchase_amount=10&app_id=271837082690554&access_token=EAAD3PADAIZCoBO4wRTyTrOGa74Q341dAStsOZATIKLKcJxWijXjjBGNrXDPg5gkgdRP5cAYBL30GJErnU0y4sQaCFvZB27Ofh898y6a87PEEOxRd1eIZAgzCrZBEhl8BZAz8ii76OwOT5FvvHqSlXJNmy2alIlrCsm9zDDRLPFPTvZBesQaZAXW5ZCwSh9ZBvsCDbO"

//=================++++{keitaro endpoint }=================================================

const getKeitaroSecondLinkWithUser = async (req, url) => {
  let link = "";
  // const userExists = userData;

  try {
    // Forward the request to Server 2
    //========={start: execute later}=======================================
    console.log({ stage2: "calling keitaro campaign 1" });

    // Create an HTTPS agent that ignores SSL certificate errors
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const response = await axios.get(url, {
      headers: req.headers, // Forward original headers if needed
      httpsAgent: agent, // Use the agent that ignores SSL errors
    });

    if (response.data) {
      link = response.data;

      if (link.startsWith("http://") || link.startsWith("https://")) {
        console.log("The string starts with 'http' or 'https'.");
        // link = link; // without params
        link = link + defaultRequestURL; // adding affiliate link
        console.log({
          stage4: "sending keitaro campaign 2 link with params if available",
        });

        // if (userExists && userExists.affiliateLink) {
        //   // link = link + `${userExists?.affiliateLink}`; // adding affiliate link
        //   link = link + defaultRequestURL; // adding affiliate link
        // }

        console.log({ userLink: link });
        return link;
      }
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log(message);
    console.log({
      stage6: "return error 404 for unsupported region",
    });

    // res.status(400).json(message);
    return message;
  }
};

// const link1 =
//   "https://www.wingsofflimits.pro/?sub1=NPR&sub2=291735090&fbp=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD";
// const link2 =
//   "https://www.wingsofflimits.pro/?sub1=NPR&fbp=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD";
// const link3 =
//   "https://www.wingsofflimits.pro/?sub1=NPR&sub2=291735090&sub3=NPR&sub4=vidos1&sub5={{ad.id}}&sub6=method1&fbp=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD";

// add advertiser_tracking_id to installed API call in unity app

//Advacned setup

app.get("/advanced_setup", async (req, res) => {
  //======{request objects}====================================
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { advertiser_tracking_id } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  //============{state variables}====================================

  let updatedLink = backend + requestURL;
  let facebookLink = "";

  //============{data iterations}====================================
  // Check if user email already exists
  const userExists = await User.findOne({ ipAddress: ip });
  const userTrackingIdExists = await User.findOne({
    advertiserTrackingId: advertiser_tracking_id,
  });

  //Activate App: fb_mobile_activate_app

  await checkFacebookAppActivationEvent();

  if (!userExists) {
    console.log("new user");

    const newUser = await User.create({
      ipAddress: ip,
      userLink: updatedLink,
    });

    if (newUser) {
      console.log({ "New user created": newUser });
      const appStoreLink = process.env.APP_STORE_LINK;
      console.log("app install in progress");
      return res.redirect(appStoreLink);
    }
  }

  if (
    advertiser_tracking_id &&
    userTrackingIdExists &&
    advertiser_tracking_id != userExists?.advertiserTrackingId
  ) {
    console.log("new user");

    const newUser = await User.create({
      ipAddress: ip,
      userLink: defaultRequestURL,
      advertiserTrackingId: advertiser_tracking_id,
    });

    if (newUser) {
      console.log({
        "New user created with same ip but new advertiserId": newUser,
      });
      const appStoreLink = process.env.APP_STORE_LINK;
      console.log("app install in progress");
      return res.redirect(appStoreLink);
    }
  }

  if (advertiser_tracking_id && !userExists.advertiserTrackingId) {
    userExists.advertiserTrackingId =
      advertiser_tracking_id || userExists.advertiserTrackingId;

    const updatedUser = await userExists.save();

    if (updatedUser) {
      console.log({ "User updated": updatedUser });
    }
  }
  console.log("user exists");
  try {
    facebookLink = await getKeitaroSecondLinkWithUser(
      req,
      keitaroFirstCampaign
    );
    console.log("sending link");
    let newLink = facebookLink;

    console.log({ redirectLink: newLink });

    res.json(newLink);
  } catch (error) {
    res.status(400).json(error);
  }
});
app.get("/one", async (req, res) => {
  //======{request objects}====================================
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { advertiser_tracking_id } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  //============{state variables}====================================
  let facebookLink = backend + defaultRequestURL;

  //============{data iterations}====================================
  // Check if user email already exists
  const userExists = await User.findOne({ ipAddress: ip });
  const userTrackingIdExists = await User.findOne({
    advertiserTrackingId: advertiser_tracking_id,
  });

  //Activate App: fb_mobile_activate_app

  await checkFacebookAppActivationEvent();

  if (!userExists) {
    console.log("new user");

    const newUser = await User.create({
      ipAddress: ip,
      userLink: defaultRequestURL,
    });

    if (newUser) {
      console.log({ "New user created": newUser });
      const appStoreLink = process.env.APP_STORE_LINK;
      console.log("app install in progress");
      return res.redirect(appStoreLink);
    }
  }

  if (
    advertiser_tracking_id &&
    userTrackingIdExists &&
    advertiser_tracking_id != userExists?.advertiserTrackingId
  ) {
    console.log("new user");

    const newUser = await User.create({
      ipAddress: ip,
      userLink: defaultRequestURL,
      advertiserTrackingId: advertiser_tracking_id,
    });

    if (newUser) {
      console.log({
        "New user created with same ip but new advertiserId": newUser,
      });
      const appStoreLink = process.env.APP_STORE_LINK;
      console.log("app install in progress");
      return res.redirect(appStoreLink);
    }
  }

  if (advertiser_tracking_id && !userExists.advertiserTrackingId) {
    userExists.advertiserTrackingId =
      advertiser_tracking_id || userExists.advertiserTrackingId;

    const updatedUser = await userExists.save();

    if (updatedUser) {
      console.log({ "User updated": updatedUser });

      console.log("sending link");
      newLink = facebookLink;

      console.log({ redirectLink: newLink });

      res.json(newLink);
    }
  } else if (userTrackingIdExists) {
    console.log("user exists");
    console.log("app launch successful");
    console.log({ marketerLink: facebookLink });

    console.log("sending link");
    newLink = facebookLink;

    console.log({ redirectLink: newLink });

    res.json(newLink);
  } else {
    console.log("user exists");
    console.log("app launch successful");
    console.log({ marketerLink: facebookLink });

    console.log("sending link");
    newLink = facebookLink;

    console.log({ redirectLink: newLink });

    res.json(newLink);
  }

  // console.log("sending link");
  // newLink = facebookLink;

  // console.log({ redirectLink: newLink });

  // res.json(newLink);
});

app.get("/two", async (req, res) => {
  //======{request objects}====================================
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { advertiser_tracking_id } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  //============{state variables}====================================
  let facebookLink = backend + defaultRequestURL;

  //============{data iterations}====================================
  // Check if user email already exists
  const userExists = await User.findOne({ ipAddress: ip });
  const userTrackingIdExists = await User.findOne({
    advertiserTrackingId: advertiser_tracking_id,
  });

  //Activate App: fb_mobile_activate_app

  await checkFacebookAppActivationEvent();

  if (!userExists) {
    console.log("new user");

    const newUser = await User.create({
      ipAddress: ip,
      userLink: defaultRequestURL,
    });

    if (newUser) {
      console.log({ "New user created": newUser });
      const appStoreLink = process.env.APP_STORE_LINK;
      console.log("app install in progress");
      return res.redirect(appStoreLink);
    }
  }

  // if (
  //   advertiser_tracking_id &&
  //   userTrackingIdExists &&
  //   advertiser_tracking_id != userExists?.advertiserTrackingId
  // ) {
  //   console.log("new user");

  //   const newUser = await User.create({
  //     ipAddress: ip,
  //     userLink: defaultRequestURL,
  //     advertiserTrackingId: advertiser_tracking_id,
  //   });

  //   if (newUser) {
  //     console.log({
  //       "New user created with same ip but new advertiserId": newUser,
  //     });
  //     const appStoreLink = process.env.APP_STORE_LINK;
  //     console.log("app install in progress");
  //     return res.redirect(appStoreLink);
  //   }
  // }

  if (advertiser_tracking_id && !userExists.advertiserTrackingId) {
    userExists.advertiserTrackingId =
      advertiser_tracking_id || userExists.advertiserTrackingId;

    const updatedUser = await userExists.save();

    if (updatedUser) {
      console.log({ "User updated": updatedUser });

      console.log("sending link");
      const newLink = facebookLink;

      console.log({ redirectLink: newLink });

      res.json(newLink);
    }
  } else if (userTrackingIdExists) {
    console.log("user exists");
    console.log("app launch successful");
    console.log({ marketerLink: facebookLink });

    console.log("sending link");
    const newLink = facebookLink;

    console.log({ redirectLink: newLink });

    res.json(newLink);
  } else {
    console.log("user exists");
    console.log("app launch successful");
    console.log({ marketerLink: facebookLink });

    console.log("sending link");
    const newLink = facebookLink;

    console.log({ redirectLink: newLink });

    res.json(newLink);
  }

  // console.log("sending link");
  // newLink = facebookLink;

  // console.log({ redirectLink: newLink });

  // res.json(newLink);
});

app.get("/three", async (req, res) => {
  //======{request objects}====================================
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { sub_id_1, advertiser_tracking_id } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  let facebookLink = "";
  if (sub_id_1) {
    facebookLink = backend + requestURL;
  } else {
    facebookLink = backend + defaultRequestURL;
  }
  //============{state variables}====================================

  //============{data iterations}====================================
  // Check if user email already exists
  const userExists = await User.findOne({ ipAddress: ip });
  const userTrackingIdExists = await User.findOne({
    advertiserTrackingId: advertiser_tracking_id,
  });

  //Activate App: fb_mobile_activate_app

  await checkFacebookAppActivationEvent();

  if (!userExists) {
    console.log("new user");

    const newUser = await User.create({
      ipAddress: ip,
      userLink: facebookLink,
    });

    if (newUser) {
      console.log({ "New user created": newUser });
      const appStoreLink = process.env.APP_STORE_LINK;
      console.log("app install in progress");
      return res.redirect(appStoreLink);
    }
  }

  // if (
  //   advertiser_tracking_id &&
  //   userTrackingIdExists &&
  //   advertiser_tracking_id != userExists?.advertiserTrackingId
  // ) {
  //   console.log("new user");

  //   const newUser = await User.create({
  //     ipAddress: ip,
  //     userLink: defaultRequestURL,
  //     advertiserTrackingId: advertiser_tracking_id,
  //   });

  //   if (newUser) {
  //     console.log({
  //       "New user created with same ip but new advertiserId": newUser,
  //     });
  //     const appStoreLink = process.env.APP_STORE_LINK;
  //     console.log("app install in progress");
  //     return res.redirect(appStoreLink);
  //   }
  // }

  if (advertiser_tracking_id && !userExists.advertiserTrackingId) {
    userExists.advertiserTrackingId =
      advertiser_tracking_id || userExists.advertiserTrackingId;

    const updatedUser = await userExists.save();
    let newLink = "";

    if (updatedUser) {
      console.log({ "User updated": updatedUser });

      console.log("sending link");
      // const newLink = facebookLink;
      newLink = updatedUser?.userLink;

      console.log({ redirectLink: newLink });
    }
    res.json(newLink);
  } else if (userTrackingIdExists) {
    console.log("user exists");
    console.log("app launch successful");
    console.log({ marketerLink: facebookLink });

    console.log("sending link");

    const newLink = userTrackingIdExists?.userLink;
    // const newLink = facebookLink;

    console.log({ redirectLink: newLink });

    res.json(newLink);
  } else if (userExists && !userTrackingIdExists) {
    console.log("user exists");
    console.log("app launch successful");
    console.log({ marketerLink: facebookLink });

    console.log("sending link");

    const newLink = userExists?.userLink;
    // const newLink = facebookLink;

    console.log({ redirectLink: newLink });

    res.json(newLink);
  } else {
    console.log("user exists");
    console.log("app launch successful");
    console.log({ marketerLink: facebookLink });

    console.log("sending link");
    const newLink = facebookLink;

    console.log({ redirectLink: newLink });

    res.json(newLink);
  }

  // console.log("sending link");
  // newLink = facebookLink;

  // console.log({ redirectLink: newLink });

  // res.json(newLink);
});

app.get("/four", async (req, res) => {
  //======{request objects}====================================
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { sub_id_1, advertiser_tracking_id } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  let facebookLink = "";
  if (sub_id_1) {
    facebookLink = backend + requestURL;
  } else {
    facebookLink = backend + defaultRequestURL;
  }
  //============{state variables}====================================

  //============{data iterations}====================================
  // Check if user email already exists
  const userExists = await User.findOne({ ipAddress: ip });
  const userTrackingIdExists = await User.findOne({
    advertiserTrackingId: advertiser_tracking_id,
  });

  //Activate App: fb_mobile_activate_app

  await checkFacebookAppActivationEvent();

  if (!userExists) {
    console.log("new user");

    const newUser = await User.create({
      ipAddress: ip,
      userLink: facebookLink,
    });

    if (newUser) {
      console.log({ "New user created": newUser });
      const appStoreLink = process.env.APP_STORE_LINK;
      console.log("app install in progress");
      return res.redirect(appStoreLink);
    }
  }

  // if (
  //   advertiser_tracking_id &&
  //   userTrackingIdExists &&
  //   advertiser_tracking_id != userExists?.advertiserTrackingId
  // ) {
  //   console.log("new user");

  //   const newUser = await User.create({
  //     ipAddress: ip,
  //     userLink: defaultRequestURL,
  //     advertiserTrackingId: advertiser_tracking_id,
  //   });

  //   if (newUser) {
  //     console.log({
  //       "New user created with same ip but new advertiserId": newUser,
  //     });
  //     const appStoreLink = process.env.APP_STORE_LINK;
  //     console.log("app install in progress");
  //     return res.redirect(appStoreLink);
  //   }
  // }

  if (advertiser_tracking_id && !userExists.advertiserTrackingId) {
    userExists.advertiserTrackingId =
      advertiser_tracking_id || userExists.advertiserTrackingId;

    const updatedUser = await userExists.save();
    let newLink = "";

    if (updatedUser) {
      console.log({ "User updated": updatedUser });

      console.log("sending link");
      // const newLink = facebookLink;
      newLink = updatedUser?.userLink;

      console.log({ redirectLink: newLink });
    }
    res.json(newLink);
  }

  if (userTrackingIdExists) {
    console.log("user exists");
    console.log("app launch successful");
    console.log({ marketerLink: facebookLink });

    console.log("sending link");

    const newLink = userTrackingIdExists?.userLink;
    // const newLink = facebookLink;

    console.log({ redirectLink: newLink });

    res.json(newLink);
  }

  if (userExists && !userTrackingIdExists) {
    console.log("user exists");
    console.log("app launch successful");
    console.log({ marketerLink: facebookLink });

    console.log("sending link");

    const newLink = userExists?.userLink;
    // const newLink = facebookLink;

    console.log({ redirectLink: newLink });

    res.json(newLink);
  }

  // console.log("sending link");
  // newLink = facebookLink;

  // console.log({ redirectLink: newLink });

  // res.json(newLink);
});

app.get("/", async (req, res) => {
  //======{request objects}====================================
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { sub_id_1, advertiser_tracking_id } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  //============{data iterations}====================================
  // Check if user email already exists
  const userExists = await User.findOne({ ipAddress: ip });

  let userTrackingIdExists = "";

  //Activate App: fb_mobile_activate_app

  await checkFacebookAppActivationEvent();

  if (!userExists) {
    console.log("new user");

    let facebookLink = "";
    if (sub_id_1) {
      facebookLink = backend + requestURL;
    } else {
      facebookLink = backend + defaultRequestURL;
    }

    const newUser = await User.create({
      ipAddress: ip,
      userLink: facebookLink,
    });

    if (newUser) {
      console.log({ "New user created": newUser });
      const appStoreLink = process.env.APP_STORE_LINK;
      console.log("app install in progress");
      return res.redirect(appStoreLink);
    }
  }

  // if (
  //   advertiser_tracking_id &&
  //   userTrackingIdExists &&
  //   advertiser_tracking_id != userExists?.advertiserTrackingId
  // ) {
  //   console.log("new user");

  //   const newUser = await User.create({
  //     ipAddress: ip,
  //     userLink: defaultRequestURL,
  //     advertiserTrackingId: advertiser_tracking_id,
  //   });

  //   if (newUser) {
  //     console.log({
  //       "New user created with same ip but new advertiserId": newUser,
  //     });
  //     const appStoreLink = process.env.APP_STORE_LINK;
  //     console.log("app install in progress");
  //     return res.redirect(appStoreLink);
  //   }
  // }

  if (advertiser_tracking_id) {
    let newLink = "";
    userTrackingIdExists = await User.findOne({
      advertiserTrackingId: advertiser_tracking_id,
    });

    if (!userTrackingIdExists && userExists) {
      if (!userExists.advertiserTrackingId) {
        userExists.advertiserTrackingId =
          advertiser_tracking_id || userExists.advertiserTrackingId;

        const updatedUser = await userExists.save();

        if (updatedUser) {
          console.log({ "User updated": updatedUser });

          console.log("sending link");
          newLink = updatedUser?.userLink;

          console.log({ redirectLink: newLink });
        }
      } else {
        newLink = userExists?.userLink;
        console.log({ redirectLink: newLink });
      }
    }

    if (userTrackingIdExists) {
      console.log("user exists by advertiser id");
      console.log("sending link");

      newLink = userTrackingIdExists?.userLink;

      console.log({ redirectLink: newLink });
    }

    if (newLink) {
      res.json(newLink);
    }
  } else {
    const newLink = backend + defaultRequestURL;

    console.log({ redirectLink: newLink });

    res.json(newLink);
  }
});

async function checkFacebookAppActivationEvent() {
  const url = `https://graph.facebook.com/${app_id}/activities?access_token=${app_access_token}`;

  const payload = {
    event: "CUSTOM_APP_EVENTS",
    advertiser_tracking_enabled: 1,
    application_tracking_enabled: 1,
    custom_events: [{ _eventName: "fb_mobile_activate_app" }],
    skadnetwork_attribution: {
      version: "2.2",
      source_app_id: app_id,
      conversion_value: 0, // Значение для установки приложения
    },
    user_data: { anon_id: "UNIQUE_USER_ID" },
  };

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, payload, { headers: headers });

    if (response.data) {
      let result = response.data;

      console.log({ result });
      //{ result: { success: true } }
    }
    //====={New update}========================
  } catch (error) {
    // const err = error.response.data;
    console.log(error);
    console.error(error);
    // return { status: err.success, message: err.message };
    // res.json(err);
  }
}

//set marketers link inside app

// office

//AASA file path//https://www.dmtgames.pro/.well-known/apple-app-site-association
//associated domain: applinks:www.dmtgames.pro
//Step2: automtically by apple
// automatic download link for AASA file done by apple from the associated domain list created in xcode only after the app has been installed on the device
app.get("/.well-known/apple-app-site-association", (req, res) => {
  // Serve the AASA file
  // default part if no query params
  // Set the appropriate Content-Type header
  res.setHeader("Content-Type", "application/json");
  res.sendFile(__dirname + "/apple-app-site-association.json");
});

//step3: on app launch
// call this on initializing app to fetch back the original link that is needed for tracking user
// because in the associated domain, we may not have th full path, but only the root domain https://www.dmtgames.pro

app.get("/track_app_installs", async (req, res) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const { advertiser_tracking_id } = req.query;

  if (advertiser_tracking_id) {
    console.log({ advertiser_tracking_id });
  }

  const userExists = await User.findOne({ ipAddress: ip });

  //save advertiser_tracking_id to user database on first app launch
  if (userExists && !userExists.advertiserTrackingId) {
    userExists.advertiserTrackingId =
      advertiser_tracking_id || userExists.advertiserTrackingId;

    const updatedUser = await userExists.save();

    if (updatedUser) {
      console.log({ "User updated": updatedUser });
    }
  }
  console.log("checking installs");
  await createFacebookAppInstallEvent();
});

// fetch all users
app.get("/all_users", async (req, res) => {
  const allUsers = await User.find();

  if (allUsers) {
    console.log({ allUsers });
    res.status(200).json(allUsers);
  }
});

//=================={temporary usage}======================
app.get("/installed", async (req, res) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  const userExists = await User.findOne({ ipAddress: ip });

  // if only advertiser tracking id exists
  if (userExists) {
    console.log("only ip exists");
    const facebookLink = userExists.userLink;
    console.log({ installedLink: facebookLink });
    // res.redirect(newLink);
    res.json(facebookLink);
  }
});

async function createFacebookAppInstallEvent() {
  //Install: fb_mobile_install

  const url = `https://graph.facebook.com/${app_id}/activities?access_token=${app_access_token}`;

  const payload = {
    event: "CUSTOM_APP_EVENTS",
    advertiser_tracking_enabled: 1,
    application_tracking_enabled: 1,
    custom_events: [
      {
        _eventName: "fb_mobile_install",
      },
    ],
    skadnetwork_attribution: {
      version: "2.2",
      source_app_id: app_id,
      conversion_value: 0, // Значение для установки приложения
    },
    user_data: {
      anon_id: "UNIQUE_USER_ID",
    },
  };

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, payload, { headers: headers });

    if (response.data) {
      let result = response.data;

      console.log({ result });
      //{ result: { success: true } }
    }
    //====={New update}========================
  } catch (error) {
    // const err = error.response.data;
    console.log(error);
    console.error(error);
    // return { status: err.success, message: err.message };
    // res.json(err);
  }
}

//fbp and token
//token

//keitaro postback
//  "https://www.wingsofflimits.pro/create_facebook_purchase_event?fbclid={fbclid}&sub_id_10={_sub_id_10}&external_id={subid}&date={date:U}&client_ip_address={_ip}";
//  "http://localhost:4000/create_facebook_purchase_event?fbclid={fbclid}&sub_id_10={_sub_id_10}&external_id={subid}&date={date:U}&client_ip_address={_ip}";
//  "http://localhost:4000/create_facebook_purchase_event?fbclid=user123&sub_id_10=abcdefg&external_id=user123&date={date:U}&client_ip_address={_ip}";

/**
 * 
 //keitaro postback without date and client_ip_address
//  "https://www.wingsofflimits.pro/create_facebook_purchase_event?fbclid={fbclid}&sub_id_10={_sub_id_10}&external_id={subid}&client_ip_address={_ip}";
//  "http://localhost:4000/create_facebook_purchase_event?fbclid={fbclid}&sub_id_10={_sub_id_10}&external_id={subid}&client_ip_address={_ip}";
//  "http://localhost:4000/create_facebook_purchase_event?fbclid=user123&sub_id_10=abcdefg&external_id=user123&client_ip_address={_ip}";
 */

app.get("/create_facebook_purchase_event", async (req, res) => {
  //Install: fb_mobile_install

  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { fbclid, sub_id_10, external_id, date, client_ip_address } = req.query;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  // const sub_id_10 = "";
  const unixTimeNow = Math.floor(Date.now() / 1000);
  console.log({ unixTimeNow });

  const min = 1;
  const max = 9999;
  let randomNumberFloat = Math.random() * (max - min) + min;

  const random = Math.round(randomNumberFloat);
  console.log({ random });

  // Function to generate random number

  if (unixTimeNow && random) {
    console.log({ processing: "calling facebook endpoint" });
    const url = `https://graph.facebook.com/${app_id}/activities?access_token=${app_access_token}`;

    const payload = {
      event: "CUSTOM_APP_EVENTS",
      advertiser_tracking_enabled: 1,
      application_tracking_enabled: 1,
      advertiser_id: "1234",
      action_source: "website",
      event_time: date || unixTimeNow,
      event_source_url: "https://av-gameprivacypolicy.site/app",
      custom_events: [
        {
          _eventName: "fb_mobile_purchase",
          // _eventName: "Purchase", // Standard event name for purchases
          _valueToSum: 10,
          fb_currency: "USD",
        },
      ],
      skadnetwork_attribution: {
        version: "2.2",
        source_app_id: app_id,
        // conversion_value: 0,
        conversion_value: 1,
      },
      user_data: {
        external_id: external_id ? external_id.toString() : "user123",
        // client_ip_address: client_ip_address || ip,
        client_ip_address: client_ip_address || "192.168.1.1",
        client_user_agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        // fbc: "fb.1.1625247600.abcdefg",
        // fbp: "fb.1.1625247600.1234",
        fbc: `fb.1.${date || unixTimeNow}.${sub_id_10 ? sub_id_10 : "abcdefg"}`,
        fbp: `fb.1.${date || unixTimeNow}.${random}`,
        fbclid: fbclid || null, // Include fbclid if available
      },
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(url, payload, { headers: headers });

      if (response.data) {
        let result = response.data;

        console.log({ FB_purchase_event_result: result });
        //{ result: { success: true } }
      }
      //====={New update}========================
    } catch (error) {
      // const err = error.response.data;
      console.log({ FB_purchase_event_error: error });
      // console.error(error);
      if (error.response) {
        // Server responded with a status code outside the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // No response received
        console.error("Error request data:", error.request);
      } else {
        // Something else happened
        console.error("Error message:", error.message);
      }
    }
  }
});

app.get("/create_facebook_leads_event", async (req, res) => {
  //Install: fb_mobile_install

  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { fbclid, sub_id_10, external_id, date, client_ip_address } = req.query;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  // const sub_id_10 = "";
  const unixTimeNow = Math.floor(Date.now() / 1000);

  const min = 1;
  const max = 9999;
  let random = Math.random() * (max - min) + min;

  // Function to generate random number

  if (unixTimeNow && random) {
    const url = `https://graph.facebook.com/${app_id}/activities?access_token=${app_access_token}`;

    const payload = {
      event: "CUSTOM_APP_EVENTS",
      advertiser_tracking_enabled: 1,
      application_tracking_enabled: 1,
      advertiser_id: "1234",
      action_source: "website",
      event_time: date || unixTimeNow,
      event_source_url: "https://av-gameprivacypolicy.site/app",
      custom_events: [
        {
          // _eventName: "fb_mobile_purchase",
          _eventName: "Lead", // Standard event name for leads
          _valueToSum: 0,
          fb_currency: "USD",
        },
      ],
      skadnetwork_attribution: {
        version: "2.2",
        source_app_id: app_id,
        // conversion_value: 0,
        conversion_value: 1,
      },
      user_data: {
        external_id: external_id ? external_id.toString() : "user123",
        client_ip_address: client_ip_address || ip,
        client_user_agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        // fbc: "fb.1.1625247600.abcdefg",
        // fbp: "fb.1.1625247600.1234",
        fbc: `fb.1.${date || unixTimeNow}.${sub_id_10 ? sub_id_10 : "abcdefg"}`,
        fbp: `fb.1.${date || unixTimeNow}.${random}`,
        fbclid: fbclid || null, // Include fbclid if available
      },
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(url, payload, { headers: headers });

      if (response.data) {
        let result = response.data;

        console.log({ FB_purchase_event_result: result });
        //{ result: { success: true } }
      }
      //====={New update}========================
    } catch (error) {
      // const err = error.response.data;
      console.log({ FB_purchase_event_error: error });
      console.error(error);
      // return { status: err.success, message: err.message };
      // res.json(err);
    }
  }
});

/**
 * Returns the current UNIX timestamp.
 *
 * @returns {Number}
 */
async function unixTimestamp() {
  return Math.floor(Date.now() / 1000);
}

async function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Error Middleware
app.use(errorHandler);
// Connect to DB and start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server;
  })
  .catch((err) => console.log(err));
