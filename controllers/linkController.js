const Global = require("../models/Global");
const QRAnalytics = require("../models/QRAnalytics");
const QRCode = require("../models/QRCode");
const Visitor = require("../models/Visitor");
const UAParser = require("ua-parser-js");
const { geolocation } = require("@vercel/functions");

const totalActions = {
  c: "totalClicks",
  q: "totalScans",
};

const actions = {
  c: "clicks",
  q: "scans",
};

const linkClick = async (req, res) => {
  const { actionType, shortCode } = req.params;

  if (!totalActions[actionType] || !actions[actionType]) {
    return res.status(400).json({
      success: false,
      message: "Invalid URL",
    });
  }

  try {
    const geo = geolocation({
      headers: new Headers(req.headers),
    });

    const qrCode = await QRCode.findOne({
      shortCode,
      isActive: true,
    }).lean();

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: "QR not found",
      });
    }

    const visitorCookieIdKey = qrCode.userId.toString();
    const visitorCookieId = req.cookies?.[visitorCookieIdKey];

    let visitorData = null;

    if (visitorCookieId) {
      visitorData = await Visitor.findById(visitorCookieId).lean();
    }

    const isNewVisitor = !visitorData;

    if (isNewVisitor) {
      visitorData = await Visitor.create({
        shortCodes: [],
      });
    }

    const hasVisitedBefore = visitorData.shortCodes.includes(shortCode);

    const browserName =
      new UAParser(req.headers["user-agent"]).getBrowser().name || "Unknown";

    const cityName = geo.city || "Unknown";
    const currentDate = new Date().toISOString().split("T")[0];

    const analyticsFields = {
      [totalActions[actionType]]: 1,
      [`daily.${currentDate}.${actions[actionType]}`]: 1,
      [`browser.${browserName}`]: 1,
      [`cities.${cityName}`]: 1,
    };

    const globalAnalyticsUpdate = {
      $inc: {
        ...analyticsFields,
        uniqueVisitors: isNewVisitor ? 1 : 0,
      },
    };

    const qrAnalyticsUpdate = {
      $inc: {
        ...analyticsFields,
        uniqueClicks: hasVisitedBefore ? 0 : 1,
      },
    };

    const updateOperations = [
      Global.findOneAndUpdate({ userId: qrCode.userId }, globalAnalyticsUpdate),

      QRAnalytics.findOneAndUpdate({ shortCode }, qrAnalyticsUpdate),
    ];

    if (!hasVisitedBefore) {
      updateOperations.push(
        Visitor.updateOne(
          { _id: visitorData._id },
          {
            $push: {
              shortCodes: shortCode,
            },
          },
        ),
      );
    }

    await Promise.all(updateOperations);

    if (isNewVisitor) {
      res.cookie(visitorCookieIdKey, visitorData._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
      });
    }

    return res.redirect(qrCode.destinationUrl);
  } catch (err) {
    console.error("Link analytics error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// const linkClick = async (req, res) => {
//   const { actionType, shortCode } = req.params;
//   const cookies = req.cookies;
//   if (!totalActions[actionType || !actions[actionType]])
//     return res.status(400).json({
//       success: false,
//       message: "Invalid URL",
//     });
//   let visitorCookieId = null;
//   try {
//     const qrCode = await QRCode.findOne({
//       shortCode,
//       isActive: true,
//     }).lean();

//     if (!qrCode) {
//       return res.status(404).json({
//         success: false,
//         message: "QR not found",
//       });
//     }
//     let visitorCookieIdKey = qrCode.userId;
//     visitorCookieId = req.cookies?.[visitorCookieIdKey] || null;

//     let visitorData = null;

//     if (visitorCookieId) {
//       visitorData = await Visitor.findById(visitorCookieId).lean();
//     }

//     const isNewVisitor = !visitorData;

//     if (isNewVisitor) {
//       visitorData = await Visitor.create({
//         shortCodes: [],
//       });
//     }

//     const hasVisitedBefore = visitorData.shortCodes.includes(shortCode);

//     const userAgentParser = new UAParser(req.headers["user-agent"]);
//     const browserName = userAgentParser.getBrowser().name || "Unknown";

//     const geo = geolocation({
//       headers: new Headers(req.headers),
//     });
//     const cityName = geo.city || "Unknown";

//     const currentDate = new Date().toISOString().split("T")[0];
//     const globalAnalyticsUpdate = {
//       $inc: {
//         [totalActions[actionType]]: 1,
//         [`daily.${currentDate}.${actions[actionType]}`]: 1,
//         [`browser.${browserName}`]: 1,
//         [`cities.${cityName}`]: 1,
//         uniqueVisitors: isNewVisitor ? 1 : 0,
//       },
//     };

//     const qrAnalyticsUpdate = {
//       $inc: {
//         [totalActions[actionType]]: 1,
//         [`daily.${currentDate}.${actions[actionType]}`]: 1,
//         [`browser.${browserName}`]: 1,
//         [`cities.${cityName}`]: 1,
//         uniqueClicks: hasVisitedBefore ? 0 : 1,
//       },
//     };

//     const updateOperations = [
//       Global.findOneAndUpdate({ userId: qrCode.userId }, globalAnalyticsUpdate),
//       QRAnalytics.findOneAndUpdate({ shortCode }, qrAnalyticsUpdate),
//     ];

//     if (!hasVisitedBefore) {
//       updateOperations.push(
//         Visitor.updateOne(
//           { _id: visitorData._id },
//           {
//             $push: {
//               shortCodes: shortCode,
//             },
//           },
//         ),
//       );
//     }

//     await Promise.all(updateOperations);

//     if (isNewVisitor) {
//       res.cookie(visitorCookieIdKey, visitorData._id.toString(), {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Working",
//       city: geo.city || "Not working",
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

module.exports = { linkClick };
