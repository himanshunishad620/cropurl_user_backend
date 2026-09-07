const Global = require("../models/Global");
const QRAnalytics = require("../models/QRAnalytics");
const QRCode = require("../models/QRCode");
const Visitor = require("../models/Visitor");
const UAParser = require("ua-parser-js");
const { client } = require("../config/redis");

const clickLink = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const qrCode = await QRCode.findOne({
      shortCode,
      isActive: true,
    })
      .select("userId destinationUrl")
      .lean();

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    const visitorCookieIdKey = qrCode.userId.toString();
    const visitorCookieId = req.cookies?.[visitorCookieIdKey];

    const browserName =
      new UAParser(req.headers["user-agent"]).getBrowser().name || "Unknown";

    let ip = req.ip;
    let cityName;
    const key = `ipforcity:${ip}`;
    try {
      const cachedCity = await client.get(key);
      if (cachedCity) {
        cityName = cachedCity;
      } else {
        const response = await fetch(
          `https://ipinfo.io/${ip}/json?token=${process.env.IP_INFO_TOKEN}`,
        );
        if (!response.ok) {
          throw new Error(`IPinfo returned ${response.status}`);
        }
        const jsonRes = await response.json();
        cityName = jsonRes?.city || "Unknown";
        await client.set(key, cityName);
      }
    } catch (error) {
      console.error("IP/city lookup failed:", error);
      cityName = "Unknown";
    }

    const currentDate = new Date().toISOString().split("T")[0];

    let visitorData = null;
    let isNewVisitor = false;
    let hasVisitedBefore = false;

    if (visitorCookieId) {
      visitorData = await Visitor.findById(visitorCookieId)
        .select("shortCodes")
        .lean();

      if (visitorData) {
        hasVisitedBefore = visitorData.shortCodes.includes(shortCode);
      }
    }

    if (!visitorData) {
      visitorData = await Visitor.create({
        shortCodes: [shortCode],
      });

      isNewVisitor = true;
    }

    const analyticsFields = {
      totalClicks: 1,
      [`daily.${currentDate}.clicks`]: 1,
      [`browser.${browserName}`]: 1,
      [`cities.${cityName}`]: 1,
    };

    const operations = [
      Global.updateOne(
        { userId: qrCode.userId },
        {
          $inc: {
            ...analyticsFields,
            uniqueVisitors: isNewVisitor ? 1 : 0,
          },
        },
      ),

      QRCode.updateOne(
        { shortCode },
        {
          $inc: {
            totalEngagement: 1,
          },
        },
      ),

      QRAnalytics.updateOne(
        { shortCode },
        {
          $inc: {
            ...analyticsFields,
            uniqueClicks: hasVisitedBefore ? 0 : 1,
          },
        },
      ),
    ];

    if (!isNewVisitor && !hasVisitedBefore) {
      operations.push(
        Visitor.updateOne(
          { _id: visitorData._id },
          {
            $addToSet: {
              shortCodes: shortCode,
            },
          },
        ),
      );
    }

    await Promise.all(operations);

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

const scanQr = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const qrCode = await QRCode.findOne({
      shortCode,
      isActive: true,
    })
      .select("userId destinationUrl")
      .lean();

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: "QR not found",
      });
    }

    const visitorCookieIdKey = qrCode.userId.toString();
    const visitorCookieId = req.cookies?.[visitorCookieIdKey];

    const browserName =
      new UAParser(req.headers["user-agent"]).getBrowser().name || "Unknown";

    let ip = req.ip;
    let cityName;
    const key = `ipforcity:${ip}`;
    try {
      const cachedCity = await client.get(key);
      if (cachedCity) {
        cityName = cachedCity;
      } else {
        const response = await fetch(
          `https://ipinfo.io/${ip}/json?token=${process.env.IP_INFO_TOKEN}`,
        );
        if (!response.ok) {
          throw new Error(`IPinfo returned ${response.status}`);
        }
        const jsonRes = await response.json();
        cityName = jsonRes?.city || "Unknown";
        await client.set(key, cityName);
      }
    } catch (error) {
      console.error("IP/city lookup failed:", error);
      cityName = "Unknown";
    }

    const currentDate = new Date().toISOString().split("T")[0];

    let visitorData = null;
    let isNewVisitor = false;
    let hasVisitedBefore = false;

    if (visitorCookieId) {
      visitorData = await Visitor.findById(visitorCookieId)
        .select("shortCodes")
        .lean();

      if (visitorData) {
        hasVisitedBefore = visitorData.shortCodes.includes(shortCode);
      }
    }

    if (!visitorData) {
      visitorData = await Visitor.create({
        shortCodes: [shortCode],
      });

      isNewVisitor = true;
    }

    const analyticsFields = {
      totalScans: 1,
      [`daily.${currentDate}.scans`]: 1,
      [`browser.${browserName}`]: 1,
      [`cities.${cityName}`]: 1,
    };

    const operations = [
      Global.updateOne(
        { userId: qrCode.userId },
        {
          $inc: {
            ...analyticsFields,
            uniqueVisitors: isNewVisitor ? 1 : 0,
          },
        },
      ),

      QRCode.updateOne(
        { shortCode },
        {
          $inc: {
            totalEngagement: 1,
          },
        },
      ),

      QRAnalytics.updateOne(
        { shortCode },
        {
          $inc: {
            ...analyticsFields,
            uniqueClicks: hasVisitedBefore ? 0 : 1,
          },
        },
      ),
    ];

    if (!isNewVisitor && !hasVisitedBefore) {
      operations.push(
        Visitor.updateOne(
          { _id: visitorData._id },
          {
            $addToSet: {
              shortCodes: shortCode,
            },
          },
        ),
      );
    }

    await Promise.all(operations);

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
    console.error("QR analytics error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { clickLink, scanQr };
