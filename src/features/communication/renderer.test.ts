import { describe, expect, it } from "vitest";
import { render } from "@react-email/render";
import { StratifitEmail } from "./templates/stratifit-email";

describe("StratifitEmail (React Email + Resend renderer)", () => {
  it("renders the branded shell with subject and body paragraphs", async () => {
    const html = await render(
      StratifitEmail({ subject: "Hello", body: "Line one\nLine two", language: "en" }),
      { pretty: true }
    );
    expect(html).toContain("Stratifit");
    expect(html).toContain("Hello");
    expect(html).toContain("Line one");
    expect(html).toContain("Line two");
    expect(html).toContain("hello@stratifit.com");
  });

  it("renders the Stratifit logo in the header", async () => {
    const html = await render(
      StratifitEmail({
        subject: "Test",
        body: "Body",
        language: "en",
        logoUrl: "https://www.stratifit.com/stratifit-main-logo.png",
        socialLinks: {
          linkedin: "https://www.linkedin.com/company/stratifit",
          instagram: "https://www.instagram.com/stratifit",
          facebook: "https://www.facebook.com/stratifit",
          tiktok: "https://www.tiktok.com/@stratifit",
        },
      }),
      { pretty: true }
    );
    expect(html).toContain(
      "https://www.stratifit.com/stratifit-main-logo.png"
    );
    expect(html).toContain('alt="Stratifit"');
    // Social icons use the site footer links, rendered as PNG images
    // (email clients strip inline SVG).
    expect(html).toContain("https://www.linkedin.com/company/stratifit");
    expect(html).toContain("https://www.tiktok.com/@stratifit");
    expect(html).toContain(
      "https://www.stratifit.com/email-icons/linkedin.png"
    );
    expect(html).toContain("https://www.stratifit.com/email-icons/tiktok.png");
    // Footer website link uses the globe icon and strips the www prefix.
    expect(html).toContain("https://www.stratifit.com/email-icons/globe.png");
    expect(html).toContain(">stratifit.com<");
  });

  it("escapes HTML in the subject and body", async () => {
    const html = await render(
      StratifitEmail({
        subject: "<script>alert(1)</script>",
        body: "Hello <b>world</b> & co",
        language: "en",
      }),
      { pretty: true }
    );
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;b&gt;world&lt;/b&gt;");
    expect(html).toContain("&amp; co");
  });

  it("uses the localized footer location for German", async () => {
    const html = await render(
      StratifitEmail({ subject: "Test", body: "Body", language: "de" }),
      { pretty: true }
    );
    expect(html).toContain("Leipzig, Deutschland");
  });

  it("uses the localized footer location for French", async () => {
    const html = await render(
      StratifitEmail({ subject: "Test", body: "Body", language: "fr" }),
      { pretty: true }
    );
    expect(html).toContain("Leipzig, Allemagne");
  });


  it("produces a full inline-styled HTML document", async () => {
    const html = await render(
      StratifitEmail({ subject: "Test", body: "Body", language: "en" }),
      { pretty: true }
    );
    expect(html.startsWith("<!DOCTYPE")).toBe(true);
    expect(html).toContain('style="');
    expect(html).toContain("#070A10");
    expect(html).toContain("#FFFFFF");
    expect(html).toContain("#F59E0B");
    expect(html).toContain('lang="en"');
  });
});
