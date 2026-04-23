package com.dejabarclay.bookmark.service.implementation;

import com.microsoft.playwright.options.ScreenshotType;
import com.microsoft.playwright.options.WaitUntilState;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import com.microsoft.playwright.*;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class MetadataService {

    public Map<String, String> getWebsiteMetadata(String url) {
        Map<String, String> result = new HashMap<>();

        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0")
                    .timeout(5000)
                    .get();

            String title = doc.title();
            String description = doc.select("meta[name=description]").attr("content");

            if (description == null || description.isEmpty()) {
                System.out.println("Jsoup found no image, switching to Playwright...");
                description = getDescription(doc);
            }

            String image = doc.select("meta[property=og:image]").attr("abs:content");

            if (image == null || image.isEmpty()) {
                System.out.println("Jsoup found no image, switching to Playwright...");
                image = getImageWithPlaywright(url);
            }

            if ("THIS_WEBSITE_DOES_NOT_SUPPORT_AUTO_FETCHING".equals(image)) {
                result.put("error", "THIS_WEBSITE_DOES_NOT_SUPPORT_AUTO_FETCHING");
                result.put("title", title);
                result.put("description", description);
                result.put("image", "");
            } else {
                result.put("title", title);
                result.put("description", description);
                result.put("image", image);
            }

        } catch (Exception e) {
            if (e.getMessage().contains("999") || e.getMessage().contains("403")) {
                result.put("error", "THIS_WEBSITE_DOES_NOT_SUPPORT_AUTO_FETCHING");
            } else {
                result.put("error", e.getMessage());
            }
        }

        return result;
    }

    private String getDescription(Document doc) {
        String description = "";
        Element firstParagraph = doc.select("p").first();
        if (firstParagraph != null) {
            description = firstParagraph.text();

            if (description.length() > 200) {
                description = description.substring(0, 197) + "...";
            }
        }

        return description;
    }

    private String getImageWithPlaywright(String url) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
            Page page = browser.newPage();
            page.setDefaultTimeout(15000);
            page.navigate(url, new Page.NavigateOptions().setWaitUntil(WaitUntilState.DOMCONTENTLOADED));
            String jsCode = "() => {" +
                    "  const getAttr = (sel, attr) => document.querySelector(sel)?.getAttribute(attr);" +
                    "  return getAttr(\"link[rel='apple-touch-icon']\", 'href') || " +
                    "         getAttr(\"meta[property='og:image']\", 'content') || " +
                    "         getAttr(\"meta[name='twitter:image']\", 'content') || " +
                    "         getAttr(\"link[rel*='icon']\", 'href') || " +
                    "         (document.querySelector('img') ? document.querySelector('img').src : '');" +
                    "}";

            String imageUrl = (String) page.evaluate(jsCode);

            if (imageUrl == null || imageUrl.isEmpty()) {
                System.out.println("No image tags found. Capturing page screenshot...");
                byte[] screenshot = page.screenshot(new Page.ScreenshotOptions().setType(ScreenshotType.PNG));
                imageUrl = "data:image/png;base64," + java.util.Base64.getEncoder().encodeToString(screenshot);
            }

            browser.close();
            return convertToAbsoluteUrl(url, imageUrl);
        } catch (Exception e) {
            System.err.println("Playwright ultimate fallback failed: " + e.getMessage());
            return "";
        }
    }

    private String convertToAbsoluteUrl(String basePageUrl, String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return "";
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        if (imageUrl.startsWith("//")) {
            return "https:" + imageUrl;
        }

        try {
            java.net.URI baseUri = new java.net.URI(basePageUrl);
            return baseUri.resolve(imageUrl).toString();
        } catch (Exception e) {
            return imageUrl;
        }
    }
}