import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "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",
});

async function testKey() {
  try {
    const models = await client.models.list();
    console.log("✅ API key is working!");
    console.log(models.data.slice(0, 5).map(m => m.id));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testKey();
