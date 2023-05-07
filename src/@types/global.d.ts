interface OpenAIStreamPayload {
  model: string;
  messages: Message[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

interface ChatResponseData {
  id: string;
  object: string;
  created: string;
  model: string;
  choices: { delta: Partial<Message> }[];
}

type Role = "system" | "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}
