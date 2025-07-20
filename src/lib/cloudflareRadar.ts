export async function fetchCountryLatency(from: string, to: string) {
  const query = `
    {\n      countryLatency(from: \"${from}\", to: \"${to}\") {\n        avg\n        min\n        max\n        median\n        p95\n        timestamp\n      }\n    }\n  `;
  const res = await fetch('https://api.radar.cloudflare.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  return json.data.countryLatency;
} 