export default async function run(page) {
  await page.waitForSelector("section[aria-roledescription=carrousel]");
  await page.waitForTimeout(1500);

  // Quelle image de fond est réellement visible pour chaque slide ?
  const readHero = () =>
    page.evaluate(() => {
      const layers = Array.from(
        document.querySelectorAll(
          "section[aria-roledescription=carrousel] > div.absolute",
        ),
      );
      let visible = null;
      let opacity = 1;
      for (const layer of layers) {
        // descendant jusqu'à la couche réellement opaque
        let node = layer;
        let acc = 1;
        while (node) {
          acc *= parseFloat(getComputedStyle(node).opacity || "1");
          node = node.parentElement;
          if (acc === 0) break;
        }
        if (acc > 0) {
          visible = Array.from(
            layer.querySelectorAll("div[style*=background-image]"),
          )
            .filter((d) => parseFloat(getComputedStyle(d).opacity) > 0.5)
            .map((d) => d.style.backgroundImage)[0];
          opacity = acc;
          break;
        }
      }
      const badge = document.querySelector(
        "section[aria-roledescription=carrousel] .uppercase",
      )?.textContent;
      return { badge, visible, opacity };
    });

  const shots = [];
  for (let i = 0; i < 5; i++) {
    const state = await readHero();
    await page.screenshot({ path: `qa-hero-${i}.png` });
    shots.push({ slide: i, ...state });
    await page.click('button[aria-label="Slide suivant"]');
    await page.waitForTimeout(1300);
  }

  const images = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        "section[aria-roledescription=carrousel] div[style*=background-image]",
      ),
    ).map((d) => d.style.backgroundImage),
  );

  return { shots, images };
}
