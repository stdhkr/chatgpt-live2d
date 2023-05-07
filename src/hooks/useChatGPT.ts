import { showNotification } from "@mantine/notifications";
import { useAtom } from "jotai";
import { chatsAtom, replyCompletedAtom } from "@/states/atoms";
import { systemMessage } from "@/utils/constants";

export const useChatGPT = () => {
  const [chats, setChats] = useAtom(chatsAtom);
  const [replyCompleted, setReplyCompleted] = useAtom(replyCompletedAtom);

  const setReply = (value: string, isNew: boolean) => {
    setChats((old) => {
      if (isNew) {
        return [...old, { role: "assistant", content: value }];
      } else {
        const last = { ...old.slice(-1)[0] };
        const newLast = { ...last, content: last.content + value };
        return [...old.slice(0, -1), newLast];
      }
    });
  };

  const fetchStream = async (chat: Message) => {
    const messages: Message[] = [
      { role: "system", content: systemMessage },
      ...chats,
      chat,
    ];
    const findeIndex = messages.findIndex((m) => m.content.length > 2);
    if (findeIndex === -1) {
      showNotification({
        title: `入力エラー`,
        message: "質問は2文字以上にする必要があります",
        color: "red",
        autoClose: 5000,
      });
      return;
    }

    try {
      setReply("", true);
      setReplyCompleted(false);
      const body = JSON.stringify({ messages });
      const responseVercel = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      console.log("Edge function returned.");
      if (!responseVercel.ok) {
        throw new Error(responseVercel.statusText);
      }

      // This data is a ReadableStream
      const data = responseVercel.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setReply(chunkValue, false);
      }
      setReplyCompleted(true);
    } catch (error: any) {
      alert(error);
      showNotification({
        title: `error`,
        message: error,
        color: "red",
        autoClose: 5000,
      });
    }
  };

  const getLastChat = () => {
    const find = chats.findLast((c) => c.role === "assistant");
    return find;
  };

  return {
    fetchStream,
    chats,
    setChats,
    getLastChat,
    replyCompleted,
  };
};
