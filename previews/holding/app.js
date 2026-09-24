(() => {
  const stamp = document.getElementById("stamp");
  if (!stamp) return;
  try {
    const d = new Date();
    stamp.textContent = d.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "America/Toronto",
    });
  } catch {
    /* keep static fallback */
  }
})();
