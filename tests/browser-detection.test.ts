import assert from "node:assert/strict";
import {test} from "node:test";
import {findInstalledBrowser} from "../scripts/lib/browser.mjs";

test("browser detection returns the first installed candidate", () => {
  const candidates = ["/first", "/second", "/third"];
  const found = findInstalledBrowser(
    candidates,
    (candidate) => candidate === "/second" || candidate === "/third",
  );

  assert.equal(found, "/second");
});

test("browser detection returns null when no candidate exists", () => {
  const found = findInstalledBrowser(["/missing"], () => false);
  assert.equal(found, null);
});
