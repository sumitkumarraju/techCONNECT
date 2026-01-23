
async function benchmark() {
  const url = 'http://localhost:3000/api/challenges';
  const iterations = 50;
  let totalTime = 0;
  let successCount = 0;

  console.log(`Starting benchmark for ${url} with ${iterations} iterations...`);

  // Warmup
  try {
    await fetch(url);
  } catch (e: any) {
    console.error('Warmup failed, server might not be ready:', e.message);
    return;
  }

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    try {
      const res = await fetch(url);
      if (res.ok) {
        const end = performance.now();
        totalTime += (end - start);
        successCount++;
      } else {
        console.error(`Request ${i} failed with status: ${res.status}`);
      }
    } catch (error: any) {
      console.error(`Request ${i} failed:`, error.message);
    }
  }

  if (successCount > 0) {
    const avgTime = totalTime / successCount;
    console.log(`Benchmark Complete.`);
    console.log(`Successful Requests: ${successCount}/${iterations}`);
    console.log(`Average Response Time: ${avgTime.toFixed(2)}ms`);
  } else {
    console.log('No successful requests.');
  }
}

benchmark();
