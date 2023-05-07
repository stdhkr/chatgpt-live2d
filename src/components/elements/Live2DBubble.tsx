import { useMemo, useEffect } from "react";
import axios from "axios";
import { Text, Flex, Paper } from "@mantine/core";
import { useModel } from "@/hooks/useModel";
import { useChatGPT } from "@/hooks/useChatGPT";
import { useRouter } from "next/router";

export const Live2DBubble = () => {
  const router = useRouter();
  const { lipSync } = useModel();
  const { getLastChat, chats, replyCompleted } = useChatGPT();

  const chat = useMemo(() => {
    return getLastChat();
  }, [chats]);

  useEffect(() => {
    if (!replyCompleted || !chat) {
      return;
    }
    handleSynthesize();
  }, [replyCompleted]);

  async function fetchAudioURL(text: string) {
    // save-audio APIエンドポイントにリクエストを送信し、一時ファイル名を取得
    const speaker = 8;
    const response = await axios.post(
      "/api/save-audio",
      { text },
      { params: { speaker } }
    );
    const { fileName } = response.data;

    // 一時ファイルへのリンクを生成
    const audioURL = `/api/audio/${fileName}`;

    return audioURL;
  }

  const handleSynthesize = async () => {
    try {
      const text = getLastChat()?.content;
      if (!text) {
        return;
      }
      const audioURL = await fetchAudioURL(text);
      const protocol = window.location.protocol;
      const host = window.location.host;
      lipSync(`${protocol}//${host}/${audioURL}`);
    } catch (error) {
      console.error("音声合成に失敗しました:", error);
    }
  };

  return (
    <Flex
      w="100%"
      direction="column"
      align="center"
      sx={{ position: "absolute", top: 16 /*bottom: "80%"*/ }}
    >
      <Paper
        shadow="md"
        radius={16}
        maw={400}
        p={16}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Text>
          {chat?.content
            ? chat.content
            : replyCompleted
            ? " 今日はどうしたの？"
            : "えーとね。。"}
        </Text>
      </Paper>
    </Flex>
  );
};
