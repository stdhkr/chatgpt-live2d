import { OpenAIChatStream } from "@/utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { messages } = (await req.json()) as {
      messages?: Message[];
    };

    if (!messages) {
      return new Response("No prompt in the request", { status: 400 });
    }

    const payload: OpenAIStreamPayload = {
      //model: "gpt-4",
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1000,
      stream: true,
      n: 1,
    };

    const stream = await OpenAIChatStream(payload);
    return new Response(stream);
  } catch (error: any) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

export default handler;
