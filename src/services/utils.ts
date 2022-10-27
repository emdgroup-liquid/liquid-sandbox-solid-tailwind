export async function simulateFetch() {
  await new Promise((resolve) => setTimeout(resolve, 250 + Math.random() * 250))
}
