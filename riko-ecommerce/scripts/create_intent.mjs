const endpoint = process.env.INTENTS_URL || 'http://localhost:3000/api/stripe-intents';

async function main() {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000, currency: 'mxn' }),
    });
    const text = await res.text();
    console.log(text);
    if (!res.ok) process.exit(1);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();



