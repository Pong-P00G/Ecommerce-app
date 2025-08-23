import { describe, it, expect, beforeEach } from "vitest";
import { onClickDownloadReceipt } from "../utility/DownloadResipt.js";

describe("DowlodadReceipt", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("alerts if no order details found", () => {
    localStorage.setItem("lastOrderNumber", "123");
    localStorage.setItem("lastOrderDetails", JSON.stringify({ items: [] }));

    onClickDownloadReceipt();

    expect(global.alert).toHaveBeenCalledWith("No order details found.");
  });

  it("generates PDF when valid order details exist", async () => {
    localStorage.setItem("lastOrderNumber", "123");
    localStorage.setItem(
      "lastOrderDetails",
      JSON.stringify({
        date: "2025-08-22",
        time: "15:30",
        total: 59.99,
        items: [{ name: "T-Shirt", size: "M", color: "Black", quantity: 2, price: 20 }],
      })
    );

    onClickDownloadReceipt();

    // wait for debounce
    await new Promise((r) => setTimeout(r, 350));

    const progressDiv = document.querySelector("#progress");
    expect(progressDiv).not.toBeNull();
    expect(progressDiv.textContent).toContain("Generating PDF");
  });
});